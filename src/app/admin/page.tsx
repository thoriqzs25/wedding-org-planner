"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import ConfirmDialog from "@/components/ConfirmDialog";
import { mockAccounts, mockQuestionnaire } from "@/data/mock";
import type { Account, AccountStatus } from "@/types";

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
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gold/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-orange">
              Wedding<span className="text-pink">Kit</span>
            </h1>
            <span className="text-sm text-amber-800/40 font-medium">Admin Panel</span>
          </div>
          <a
            href="/"
            className="text-sm text-amber-800/60 hover:text-orange transition-colors flex items-center gap-1"
          >
            <Icon name="arrow_back" size={16} />
            Back to App
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Account Management</h2>
            <p className="text-sm text-amber-800/60 mt-1">
              Manage all registered wedding accounts
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-800/60">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green" /> {activeCount} Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-300" /> {inactiveCount} Inactive
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gold/30 overflow-hidden">
          <div className="p-4 border-b border-gold/20">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by bride, groom, or username..."
              className="w-full max-w-md px-4 py-2 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream text-amber-800/70 text-left">
                  <th className="px-4 py-3 font-medium">Bride</th>
                  <th className="px-4 py-3 font-medium">Groom</th>
                  <th className="px-4 py-3 font-medium">Wedding Date</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Budget Tier</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((account) => (
                  <tr
                    key={account.id}
                    className="border-t border-gold/10 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-amber-900 font-medium">{account.brideName}</td>
                    <td className="px-4 py-3 text-amber-900">{account.groomName}</td>
                    <td className="px-4 py-3 text-amber-800/70">{account.weddingDate}</td>
                    <td className="px-4 py-3 text-amber-800/60 font-mono text-xs">{account.username}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gold/20 text-amber-800">
                        {getBudgetDisplay(account.budgetTier)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(account)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          account.status === "active"
                            ? "bg-green/10 text-green"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            account.status === "active" ? "bg-green" : "bg-amber-400"
                          }`}
                        />
                        {account.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(account)}
                          className="p-2 rounded-lg hover:bg-gold/20 text-amber-600 transition-colors"
                          title="Edit"
                        >
                          <Icon name="edit" size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(account)}
                          className="p-2 rounded-lg hover:bg-pink/10 text-pink transition-colors"
                          title="Delete"
                        >
                          <Icon name="delete" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-amber-800/40">
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-amber-800/30 text-center mt-6">
          v1.0.0 &middot; WeddingKit Admin
        </p>
      </main>

      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingAccount(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-amber-900">Edit Account</h3>
              <button
                onClick={() => setEditingAccount(null)}
                className="p-1 rounded-lg hover:bg-cream text-amber-600 transition-colors"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={editBride}
                  onChange={(e) => setEditBride(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={editGroom}
                  onChange={(e) => setEditGroom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Budget Tier
                </label>
                <select
                  value={editBudgetTier}
                  onChange={(e) => setEditBudgetTier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900"
                >
                  <option value="murah">Low</option>
                  <option value="menengah-bawah">Mid-Low</option>
                  <option value="menengah-atas">Mid-High</option>
                  <option value="mewah">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AccountStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingAccount(null)}
                className="flex-1 py-2.5 rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 rounded-xl bg-orange text-white font-medium hover:bg-orange/90 transition-colors"
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
