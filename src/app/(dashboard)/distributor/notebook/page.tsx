"use client";
import React, { useState, useEffect } from "react";
import { format, isBefore, isAfter, isToday, parseISO } from "date-fns";

const TABS = ["Follow-up", "Free Flow"];
const STATUS_COLORS = {
  overdue: "bg-red-100 text-red-800",
  upcoming: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
};

interface Note {
  person?: string;
  dueDate?: string;
  title?: string;
  completed?: boolean;
  followUpBy?: string;
  reason?: string;
  reminder?: boolean;
  content?: string;
}

type NoteStatus = 'overdue' | 'upcoming' | 'completed';

function getStatus(note: Note): NoteStatus {
  if (note.completed) return "completed";
  if (!note.dueDate) return "upcoming";
  const dueDate = parseISO(note.dueDate);
  if (isBefore(dueDate, new Date())) return "overdue";
  return "upcoming";
}

export default function NotebookPage() {
  const [tab, setTab] = useState("Follow-up");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [followUps, setFollowUps] = useState<Note[]>([]);
  const [freeFlows, setFreeFlows] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch notes from API
    setLoading(false);
  }, []);

  // Filter and sort logic
  const filteredFollowUps = followUps
    .filter((n) =>
  (!search || (n.person?.toLowerCase().includes(search.toLowerCase()))) &&
  (!dateRange.from || !n.dueDate || isAfter(parseISO(n.dueDate), parseISO(dateRange.from))) &&
  (!dateRange.to || !n.dueDate || isBefore(parseISO(n.dueDate), parseISO(dateRange.to)))
    )
  .sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
  });

  const filteredFreeFlows = freeFlows.filter((n) =>
  !search || (n.title?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Distributor Notebook</h1>
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded-full font-semibold border ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search..."
          className="ml-auto px-3 py-1 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="px-2 py-1 border rounded"
          value={dateRange.from}
          onChange={(e) => setDateRange((r) => ({ ...r, from: e.target.value }))}
        />
        <input
          type="date"
          className="px-2 py-1 border rounded"
          value={dateRange.to}
          onChange={(e) => setDateRange((r) => ({ ...r, to: e.target.value }))}
        />
      </div>
      {tab === "Follow-up" ? (
        <FollowUpTab
          notes={filteredFollowUps}
          loading={loading}
          onAdd={(note: Note) => setFollowUps((n: Note[]) => [...n, note])}
          onEdit={(idx: number, note: Note) => setFollowUps((n: Note[]) => n.map((v, i) => (i === idx ? note : v)))}
          onDelete={(idx: number) => setFollowUps((n: Note[]) => n.filter((_, i) => i !== idx))}
          onComplete={(idx: number) => setFollowUps((n: Note[]) => n.map((v, i) => (i === idx ? { ...v, completed: true } : v)))}
        />
      ) : (
        <FreeFlowTab
          notes={filteredFreeFlows}
          loading={loading}
          onAdd={(note: Note) => setFreeFlows((n: Note[]) => [...n, note])}
        />
      )}
    </div>
  );
}

interface FollowUpTabProps {
  notes: Note[];
  loading: boolean;
  onAdd: (note: Note) => void;
  onEdit: (idx: number, note: Note) => void;
  onDelete: (idx: number) => void;
  onComplete: (idx: number) => void;
}
function FollowUpTab({ notes, loading, onAdd, onEdit, onDelete, onComplete }: FollowUpTabProps) {
  const [form, setForm] = useState({
    person: "",
    followUpBy: "",
    dueDate: "",
    reason: "",
    reminder: false,
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.person || !form.dueDate) return;
    onAdd({ ...form, completed: false });
    setForm({ person: "", followUpBy: "", dueDate: "", reason: "", reminder: false });
  };
  return (
    <div>
      <form className="mb-6 grid gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Person name"
          className="border rounded px-3 py-2"
          value={form.person}
          onChange={(e) => setForm((f) => ({ ...f, person: e.target.value }))}
          required
        />
        <div className="flex gap-2">
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={form.followUpBy}
            onChange={(e) => setForm((f) => ({ ...f, followUpBy: e.target.value }))}
            placeholder="Follow-up by"
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            required
            placeholder="Due date"
          />
        </div>
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.reminder}
            onChange={(e) => setForm((f) => ({ ...f, reminder: e.target.checked }))}
          />
          Set Reminder
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Add Follow-up</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">No follow-ups yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note: Note, idx: number) => (
            <FollowUpCard
              key={idx}
              note={note}
              status={getStatus(note)}
              onEdit={() => onEdit(idx, { ...note })}
              onDelete={() => onDelete(idx)}
              onComplete={() => onComplete(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FollowUpCardProps {
  note: Note;
  status: NoteStatus;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

function FollowUpCard({ note, status, onEdit, onDelete, onComplete }: FollowUpCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
      <div className="font-bold text-lg mb-1">{note.person}</div>
      <div className="flex gap-4 text-sm text-gray-600 mb-1">
        <span className="flex items-center gap-1">
          <span role="img" aria-label="calendar">📅</span> {note.followUpBy && `Follow-up: ${format(parseISO(note.followUpBy), "MMM d, yyyy")}`}
        </span>
        <span className="flex items-center gap-1">
          <span role="img" aria-label="calendar">📅</span> Due: {note.dueDate ? format(parseISO(note.dueDate), "MMM d, yyyy") : "Not set"}
        </span>
      </div>
      <div className="text-gray-700 mb-1">{note.reason?.slice(0, 80)}{note.reason && note.reason.length > 80 ? "..." : ""}</div>
      <div className={`inline-block px-2 py-1 rounded ${STATUS_COLORS[status]} font-semibold text-xs mb-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
      <div className="flex gap-2 mt-2">
        <button className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={onEdit}>Edit</button>
        <button className="text-xs px-2 py-1 bg-green-200 rounded hover:bg-green-300" onClick={onComplete}>Mark Complete</button>
        <button className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

interface FreeFlowTabProps {
  notes: Note[];
  loading: boolean;
  onAdd: (note: Note) => void;
}

function FreeFlowTab({ notes, loading, onAdd }: FreeFlowTabProps) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    reminder: false,
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    onAdd({ ...form });
    setForm({ title: "", content: "", reminder: false });
  };
  return (
    <div>
      <form className="mb-6 grid gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="border rounded px-3 py-2"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <textarea
          className="border rounded px-3 py-2 min-h-[100px]"
          placeholder="Write your note..."
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.reminder}
            onChange={(e) => setForm((f) => ({ ...f, reminder: e.target.checked }))}
          />
          Set Reminder
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Save Note</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">No notes yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note, idx) => (
            <FreeFlowCard key={idx} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FreeFlowCardProps {
  note: Note;
}

function FreeFlowCard({ note }: FreeFlowCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="font-bold text-lg mb-1">{note.title}</div>
      <div className="text-gray-700 mb-2 whitespace-pre-line">{note.content}</div>
      {note.reminder && (
        <div className="text-xs text-blue-600">Reminder set</div>
      )}
    </div>
  );
}
