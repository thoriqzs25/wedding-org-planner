"use client";

import { useState } from "react";
import { mockCalendarEvents } from "@/data/mock";
import { CalendarEvent } from "@/types";
import Icon from "@/components/Icon";
import CalendarFormModal from "@/components/CalendarFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function CalendarPage() {
  const [events, setEvents] = useState(mockCalendarEvents);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const handleSave = (data: Omit<CalendarEvent, "id"> & { id?: string }) => {
    if (data.id) {
      setEvents((prev) => prev.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
    } else {
      setEvents([...events, { ...data, id: `e${Date.now()}` } as CalendarEvent]);
    }
    setShowForm(false);
    setEditingEvent(undefined);
  };

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Kalender</h1>
          <p className="text-amber-800/60">Jadwalkan meeting dan deadline persiapan</p>
        </div>
        <button onClick={() => { setEditingEvent(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Jadwal
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold/30 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gold/30">
          <button onClick={prevMonth}
            className="w-10 h-10 rounded-xl hover:bg-cream flex items-center justify-center text-amber-900/60 hover:text-orange transition-colors">
            <Icon name="chevron_left" size={24} />
          </button>
          <h2 className="text-lg font-semibold text-amber-900">{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth}
            className="w-10 h-10 rounded-xl hover:bg-cream flex items-center justify-center text-amber-900/60 hover:text-orange transition-colors">
            <Icon name="chevron_right" size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gold/20">
          {dayNames.map((d) => (<div key={d} className="p-3 text-center text-xs font-medium text-amber-800/50">{d}</div>))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (<div key={`empty-${i}`} className="p-3" />))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            return (
              <div key={day} className={`p-2 min-h-[90px] border-b border-r border-gold/10 hover:bg-cream/50 transition-colors ${isToday ? "bg-orange/5" : ""}`}>
                <span className={`inline-flex w-7 h-7 items-center justify-center text-sm rounded-full ${isToday ? "bg-orange text-white font-semibold" : "text-amber-900"}`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <div key={event.id}
                      className="text-[10px] bg-orange/10 text-orange px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-orange/20"
                      title={event.title}
                      onClick={() => { setEditingEvent(event); setShowForm(true); }}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event list */}
      <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900 mb-4">Semua Jadwal</h2>

        {events.length === 0 ? (
          <div className="text-center py-10 text-amber-800/40">
            <Icon name="calendar_month" size={40} className="mb-3 text-amber-800/30" />
            <p className="text-sm">Belum ada jadwal</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
              <div key={event.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gold/20 hover:bg-cream/50 transition-colors cursor-pointer group"
                onClick={() => { setEditingEvent(event); setShowForm(true); }}>
                <div className="text-center min-w-[48px]">
                  <p className="text-lg font-bold text-orange leading-tight">{new Date(event.date).getDate()}</p>
                  <p className="text-[10px] text-amber-800/50">{monthNames[new Date(event.date).getMonth()].slice(0, 3)}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">{event.title}</p>
                  <p className="text-xs text-amber-800/50">{event.necessityName}</p>
                  {event.description && <p className="text-xs text-amber-800/60 mt-1">{event.description}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(event.id); }}
                  className="text-amber-800/30 hover:text-pink transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  <Icon name="delete" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <CalendarFormModal event={editingEvent} onSave={handleSave} onClose={() => { setShowForm(false); setEditingEvent(undefined); }} />
      )}
      {deleteId && (
        <ConfirmDialog title="Hapus Jadwal" message="Yakin ingin menghapus jadwal ini?"
          onConfirm={() => { setEvents(events.filter((e) => e.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
