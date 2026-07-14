"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import ConfirmDialog from "@/components/ConfirmDialog";
import { mockAccounts, mockQuestionnaire } from "@/data/mock";
import type { Account, AccountStatus } from "@/types";
import { getMaintenanceCheckItems } from "@/constants/navigation";
import { loadMaintenanceConfig, saveMaintenanceConfig } from "@/utils/maintenance";

const budgetLabels: Record<string, string> = {
  murah: "Low",
  "menengah-bawah": "Mid-Low",
  "menengah-atas": "Mid-High",
  mewah: "Luxury",
};

function getBudgetDisplay(tier: string) {
  return budgetLabels[tier] || tier;
}

export default function AdminPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [editBride, setEditBride] = useState("");
  const [editGroom, setEditGroom] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBudgetTier, setEditBudgetTier] = useState("");
  const [editStatus, setEditStatus] = useState<AccountStatus>("active");
  const [search, setSearch] = useState("");

  const maintenanceItems = getMaintenanceCheckItems();
  const [maintainedPaths, setMaintainedPaths] = useState<string[]>([]);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  useEffect(() => {
    const config = loadMaintenanceConfig();
    setMaintainedPaths(config.paths);
    setMaintenanceMessage(config.message);
  }, []);

  const toggleMaintenance = (path: string) => {
    setMaintainedPaths((prev) => {
      const next = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path];
      return next;
    });
  };

  const saveMaintenance = () => {
    saveMaintenanceConfig({ paths: maintainedPaths, message: maintenanceMessage });
  };

  const filtered = accounts.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.brideName.toLowerCase().includes(q) ||
      a.groomName.toLowerCase().includes(q) ||
      a.username.toLowerCase().includes(q)
    );
  });

  const activeCount = accounts.filter((a) => a.status === "active").length;
  const inactiveCount = accounts.filter((a) => a.status === "inactive").length;

  function openEdit(account: Account) {
    setEditingAccount(account);
    setEditBride(account.brideName);
    setEditGroom(account.groomName);
    setEditUsername(account.username);
    setEditBudgetTier(account.budgetTier);
    setEditStatus(account.status);
  }

  function saveEdit() {
    if (!editingAccount) return;
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === editingAccount.id
          ? { ...a, brideName: editBride, groomName: editGroom, username: editUsername, budgetTier: editBudgetTier as Account["budgetTier"], status: editStatus }
          : a
      )
    );
    setEditingAccount(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function toggleStatus(account: Account) {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === account.id
          ? { ...a, status: (a.status === "active" ? "inactive" : "active") as AccountStatus }
          : a
      )
    );
  }

  return (
    <div id="admin-page" className="min-h-screen bg-cream">
      <header id="admin-header" className="bg-white border-b border-gold/30 shadow-sm">
        <div id="admin-header-inner" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div id="admin-header-logo" className="flex items-center gap-3">
            <h1 id="admin-title" className="text-lg sm:text-xl font-bold text-orange">
              Wedding<span id="admin-title-highlight" className="text-pink">Kit</span>
            </h1>
            <span id="admin-header-label" className="text-xs sm:text-sm text-amber-800/40 font-medium hidden sm:inline">Admin Panel</span>
          </div>
          <a
            id="admin-back-link"
            href="/"
            className="text-xs sm:text-sm text-amber-800/60 hover:text-orange transition-colors flex items-center gap-1"
          >
            <Icon name="arrow_back" size={14} />
            <span id="admin-back-text" className="hidden sm:inline">Back to App</span>
          </a>
        </div>
      </header>

      <main id="admin-main" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div id="admin-management-header" className="flex items-center justify-between mb-6">
          <div id="admin-management-title-group">
            <h2 id="admin-management-title" className="text-xl sm:text-2xl font-bold text-amber-900">Account Management</h2>
            <p id="admin-management-desc" className="text-xs sm:text-sm text-amber-800/60 mt-1">
              Manage all registered wedding accounts
            </p>
          </div>
          <div id="admin-stats" className="flex items-center gap-2 text-xs sm:text-sm text-amber-800/60">
            <span id="admin-stats-active" className="flex items-center gap-1">
              <span id="admin-stats-active-dot" className="w-2 h-2 rounded-full bg-green" /> {activeCount} Active
            </span>
            <span id="admin-stats-inactive" className="hidden sm:flex items-center gap-1">
              <span id="admin-stats-inactive-dot" className="w-2 h-2 rounded-full bg-amber-300" /> {inactiveCount} Inactive
            </span>
          </div>
        </div>

        <div id="admin-table-card" className="bg-white rounded-2xl shadow-lg border border-gold/30 overflow-hidden">
          <div id="admin-search-bar" className="p-4 border-b border-gold/20">
            <input
              id="admin-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by bride, groom, or username..."
              className="w-full px-4 min-h-[44px] rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30 text-sm"
            />
          </div>

          {/* Desktop table */}
          <div id="admin-desktop-table" className="hidden md:block overflow-x-auto">
            <table id="admin-accounts-table" className="w-full text-sm">
              <thead id="admin-table-head">
                <tr id="admin-table-header-row" className="bg-cream text-amber-800/70 text-left">
                  <th id="admin-table-header-bride" className="px-4 py-3 font-medium">Bride</th>
                  <th id="admin-table-header-groom" className="px-4 py-3 font-medium">Groom</th>
                  <th id="admin-table-header-wedding-date" className="px-4 py-3 font-medium">Wedding Date</th>
                  <th id="admin-table-header-username" className="px-4 py-3 font-medium">Username</th>
                  <th id="admin-table-header-budget-tier" className="px-4 py-3 font-medium">Budget Tier</th>
                  <th id="admin-table-header-status" className="px-4 py-3 font-medium">Status</th>
                  <th id="admin-table-header-actions" className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="admin-table-body">
                {filtered.map((account) => (
                  <tr
                    key={account.id}
                    id={`admin-table-row-${account.id}`}
                    className="border-t border-gold/10 hover:bg-cream/50 transition-colors"
                  >
                    <td id={`admin-table-cell-bride-${account.id}`} className="px-4 py-3 text-amber-900 font-medium">{account.brideName}</td>
                    <td id={`admin-table-cell-groom-${account.id}`} className="px-4 py-3 text-amber-900">{account.groomName}</td>
                    <td id={`admin-table-cell-date-${account.id}`} className="px-4 py-3 text-amber-800/70">{account.weddingDate}</td>
                    <td id={`admin-table-cell-username-${account.id}`} className="px-4 py-3 text-amber-800/60 font-mono text-xs">{account.username}</td>
                    <td id={`admin-table-cell-budget-${account.id}`} className="px-4 py-3">
                      <span id={`admin-budget-badge-${account.id}`} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gold/20 text-amber-800">
                        {getBudgetDisplay(account.budgetTier)}
                      </span>
                    </td>
                    <td id={`admin-table-cell-status-${account.id}`} className="px-4 py-3">
                      <button
                        id={`admin-status-toggle-${account.id}`}
                        onClick={() => toggleStatus(account)}
                        className={`inline-flex items-center gap-1.5 px-3 min-h-[32px] rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          account.status === "active"
                            ? "bg-green/10 text-green"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        <span
                          id={`admin-status-dot-${account.id}`}
                          className={`w-1.5 h-1.5 rounded-full ${
                            account.status === "active" ? "bg-green" : "bg-amber-400"
                          }`}
                        />
                        {account.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td id={`admin-table-cell-actions-${account.id}`} className="px-4 py-3 text-right">
                      <div id={`admin-actions-group-${account.id}`} className="flex items-center justify-end gap-1">
                        <button
                          id={`admin-edit-btn-${account.id}`}
                          onClick={() => openEdit(account)}
                          className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gold/20 text-amber-600 transition-colors active:scale-90 cursor-pointer"
                          title="Edit"
                        >
                          <Icon name="edit" size={18} />
                        </button>
                        <button
                          id={`admin-delete-btn-${account.id}`}
                          onClick={() => setDeleteTarget(account)}
                          className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-red/10 text-red transition-colors active:scale-90 cursor-pointer"
                          title="Delete"
                        >
                          <Icon name="delete" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr id="admin-table-empty-row">
                    <td id="admin-table-empty-cell" colSpan={7} className="px-4 py-12 text-center text-amber-800/40">
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div id="admin-mobile-list" className="md:hidden divide-y divide-gold/10">
            {filtered.map((account) => (
              <div key={account.id} id={`admin-mobile-card-${account.id}`} className="p-4 space-y-3">
                <div id={`admin-mobile-card-header-${account.id}`} className="flex items-start justify-between">
                  <div id={`admin-mobile-card-info-${account.id}`}>
                    <p id={`admin-mobile-card-names-${account.id}`} className="text-sm font-medium text-amber-900">{account.brideName} & {account.groomName}</p>
                    <p id={`admin-mobile-card-date-${account.id}`} className="text-xs text-amber-800/50 mt-0.5">{account.weddingDate}</p>
                  </div>
                  <div id={`admin-mobile-card-actions-${account.id}`} className="flex gap-1">
                    <button id={`admin-mobile-edit-btn-${account.id}`} onClick={() => openEdit(account)}
                      className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gold/20 text-amber-600 transition-colors active:scale-90 cursor-pointer">
                      <Icon name="edit" size={18} />
                    </button>
                    <button id={`admin-mobile-delete-btn-${account.id}`} onClick={() => setDeleteTarget(account)}
                      className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-red/10 text-red transition-colors active:scale-90 cursor-pointer">
                      <Icon name="delete" size={18} />
                    </button>
                  </div>
                </div>
                <div id={`admin-mobile-card-meta-${account.id}`} className="flex items-center gap-3 text-xs">
                  <span id={`admin-mobile-card-username-${account.id}`} className="text-amber-800/50 font-mono">{account.username}</span>
                  <span id={`admin-mobile-budget-badge-${account.id}`} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gold/20 text-amber-800">
                    {getBudgetDisplay(account.budgetTier)}
                  </span>
                  <button
                    id={`admin-mobile-status-toggle-${account.id}`}
                    onClick={() => toggleStatus(account)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      account.status === "active"
                        ? "bg-green/10 text-green"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    <span id={`admin-mobile-status-dot-${account.id}`} className={`w-1.5 h-1.5 rounded-full ${account.status === "active" ? "bg-green" : "bg-amber-400"}`} />
                    {account.status === "active" ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div id="admin-mobile-empty" className="px-4 py-12 text-center text-amber-800/40 text-sm">
                No accounts found
              </div>
            )}
          </div>
        </div>

        <div id="admin-maintenance-card" className="bg-white rounded-2xl shadow-lg border border-gold/30 overflow-hidden mt-6">
          <div id="admin-maintenance-header" className="p-5 border-b border-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <Icon name="handyman" size={22} className="text-amber-600" />
              </div>
              <div>
                <h2 id="admin-maintenance-title" className="text-lg font-bold text-amber-900">Page Maintenance</h2>
                <p id="admin-maintenance-desc" className="text-xs text-amber-800/60 mt-0.5">
                  Configure which pages display a maintenance notice
                </p>
              </div>
            </div>
          </div>
          <div id="admin-maintenance-body" className="p-5 space-y-5">
            <div id="admin-maintenance-paths" className="space-y-3">
              <p id="admin-maintenance-paths-label" className="text-sm font-medium text-amber-900/70">Pages under maintenance</p>
              <div id="admin-maintenance-checkbox-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {maintenanceItems.map((item) => {
                  const checked = maintainedPaths.includes(item.path);
                  return (
                    <label
                      key={item.path}
                      id={`admin-maintenance-item-${item.path}`}
                      className={`flex items-center gap-3 px-4 min-h-[44px] rounded-xl border cursor-pointer transition-colors ${
                        checked
                          ? "border-orange/40 bg-orange/5"
                          : "border-gold/30 hover:border-gold/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMaintenance(item.path)}
                        className="w-4 h-4 rounded border-gold/40 text-orange focus:ring-orange/30 accent-orange"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-amber-900 truncate">{item.label}</p>
                        <p className="text-xs text-amber-800/40 font-mono truncate">{item.path}</p>
                      </div>
                      {checked && <Icon name="handyman" size={16} className="text-amber-400 shrink-0" />}
                    </label>
                  );
                })}
              </div>
            </div>
            <div id="admin-maintenance-message-field">
              <label id="admin-maintenance-message-label" className="block text-sm font-medium text-amber-900/70 mb-1">
                Maintenance message
              </label>
              <textarea
                id="admin-maintenance-message-input"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Maaf sekali pengalamanmu terganggu, datang kembali lain waktu yaa"
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30 text-sm resize-none"
                rows={3}
              />
            </div>
            <div id="admin-maintenance-actions" className="flex items-center gap-3 pt-1">
              <button
                id="admin-maintenance-save-btn"
                onClick={saveMaintenance}
                className="min-h-[44px] px-6 rounded-xl bg-orange text-white font-medium hover:bg-orange/90 transition-colors active:scale-[0.98] cursor-pointer"
              >
                Save Maintenance Config
              </button>
              <button
                id="admin-maintenance-reset-btn"
                onClick={() => {
                  setMaintainedPaths([]);
                  setMaintenanceMessage("");
                  saveMaintenanceConfig({ paths: [], message: "" });
                }}
                className="min-h-[44px] px-6 rounded-xl border border-gold/40 text-amber-800/70 font-medium hover:bg-cream transition-colors active:scale-[0.98] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <p id="admin-footer" className="text-xs text-amber-800/30 text-center mt-6">
          v1.0.0 &middot; WeddingKit Admin
        </p>
      </main>

      {editingAccount && (
        <div id="admin-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            id="admin-modal-backdrop"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingAccount(null)}
          />
          <div id="admin-modal-content" className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-5">
            <div id="admin-modal-header" className="flex items-center justify-between">
              <h3 id="admin-modal-title" className="text-lg font-semibold text-amber-900">Edit Account</h3>
              <button
                id="admin-modal-close-btn"
                onClick={() => setEditingAccount(null)}
                className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-cream text-amber-600 transition-colors active:scale-90 cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div id="admin-modal-fields" className="space-y-4">
              <div id="admin-modal-bride-field">
                <label id="admin-modal-bride-label" className="block text-sm font-medium text-amber-900/70 mb-1">
                  Bride Name
                </label>
                <input
                  id="admin-modal-bride-input"
                  type="text"
                  value={editBride}
                  onChange={(e) => setEditBride(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                />
              </div>
              <div id="admin-modal-groom-field">
                <label id="admin-modal-groom-label" className="block text-sm font-medium text-amber-900/70 mb-1">
                  Groom Name
                </label>
                <input
                  id="admin-modal-groom-input"
                  type="text"
                  value={editGroom}
                  onChange={(e) => setEditGroom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                />
              </div>
              <div id="admin-modal-username-field">
                <label id="admin-modal-username-label" className="block text-sm font-medium text-amber-900/70 mb-1">
                  Username
                </label>
                <input
                  id="admin-modal-username-input"
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                />
              </div>
              <div id="admin-modal-budget-field">
                <label id="admin-modal-budget-label" className="block text-sm font-medium text-amber-900/70 mb-1">
                  Budget Tier
                </label>
                <select
                  id="admin-modal-budget-select"
                  value={editBudgetTier}
                  onChange={(e) => setEditBudgetTier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900"
                >
                  <option id="admin-modal-budget-option-murah" value="murah">Low</option>
                  <option id="admin-modal-budget-option-menengah-bawah" value="menengah-bawah">Mid-Low</option>
                  <option id="admin-modal-budget-option-menengah-atas" value="menengah-atas">Mid-High</option>
                  <option id="admin-modal-budget-option-mewah" value="mewah">Luxury</option>
                </select>
              </div>
              <div id="admin-modal-status-field">
                <label id="admin-modal-status-label" className="block text-sm font-medium text-amber-900/70 mb-1">
                  Status
                </label>
                <select
                  id="admin-modal-status-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AccountStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900"
                >
                  <option id="admin-modal-status-option-active" value="active">Active</option>
                  <option id="admin-modal-status-option-inactive" value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div id="admin-modal-actions" className="flex gap-3 pt-2">
              <button
                id="admin-modal-cancel-btn"
                onClick={() => setEditingAccount(null)}
                className="flex-1 min-h-[44px] rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="admin-modal-save-btn"
                onClick={saveEdit}
                className="flex-1 min-h-[44px] rounded-xl bg-orange text-white font-medium hover:bg-orange/90 transition-colors active:scale-[0.98] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Account"
          message={`Are you sure you want to delete ${deleteTarget.brideName} & ${deleteTarget.groomName}'s account? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
