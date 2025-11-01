"use client";
import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar"; // Uncomment when react-big-calendar is installed
// import moment from "moment";

import { ConflictModal } from "@/components/ConflictModal";
import { DURATION_OPTIONS, DURATION_LABELS } from "./constants";

interface Booking {
  id: number;
  place: string;
  distributor: string;
  distributorPhone: string;
  date: string;
  startTime: string;
  duration: number;
  own: boolean;
}

interface FilterState {
  place: string;
  from: string;
  to: string;
  distributor: string;
}

const venuesStub = ["ISKCON Hall", "Community Center", "School Auditorium", "Park Pavilion"];
const bookingsStub: Booking[] = [
  {
    id: 1,
    place: "ISKCON Hall",
    distributor: "You",
    distributorPhone: "9999999999",
    date: new Date().toISOString().slice(0, 10),
    startTime: "10:00",
    duration: 120,
    own: true,
  },
  {
    id: 2,
    place: "Community Center",
    distributor: "Amit",
    distributorPhone: "8888888888",
    date: new Date().toISOString().slice(0, 10),
    startTime: "14:00",
    duration: 60,
    own: false,
  },
];

export default function VenuesPage() {
  const [tab, setTab] = useState("book");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [conflict, setConflict] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(bookingsStub);
  const [filter, setFilter] = useState<FilterState>({ place: "", from: "", to: "", distributor: "" });
  const [submitting, setSubmitting] = useState(false);

  // Autocomplete venues
  const venueOptions = venuesStub.filter((v) => v.toLowerCase().includes(place.toLowerCase()));

  // Conflict check stub
  const checkConflict = async () => {
    // TODO: Replace with actual API call
    const found = bookings.find(
      (b) =>
        b.place === place &&
        b.date === date &&
        b.startTime === startTime
    );
    if (found) {
      setConflict(found);
      setShowModal(true);
    } else {
      setConflict(null);
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (place && date && startTime) {
      checkConflict();
    }
    // eslint-disable-next-line
  }, [place, date, startTime]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Submit booking to backend
    setTimeout(() => {
      setBookings((b) => [
        ...b,
        {
          id: b.length + 1,
          place,
          distributor: "You",
          distributorPhone: "9999999999",
          date,
          startTime,
          duration,
          own: true,
        },
      ]);
      setSubmitting(false);
      setTab("view");
    }, 1200);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) =>
    (!filter.place || b.place.toLowerCase().includes(filter.place.toLowerCase())) &&
    (!filter.distributor || b.distributor.toLowerCase().includes(filter.distributor.toLowerCase())) &&
    (!filter.from || new Date(b.date) >= new Date(filter.from)) &&
    (!filter.to || new Date(b.date) <= new Date(filter.to))
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Venue Booking</h1>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold border ${tab === "book" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
          onClick={() => setTab("book")}
        >Book Venue</button>
        <button
          className={`px-4 py-2 rounded font-semibold border ${tab === "view" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
          onClick={() => setTab("view")}
        >View Bookings</button>
      </div>
      {tab === "book" ? (
        <form className="grid gap-4 mb-8" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Place</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              list="venue-list"
              required
            />
            <datalist id="venue-list">
              {venueOptions.map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Start Time</label>
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Duration</label>
              <select
                className="border rounded px-3 py-2"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{DURATION_LABELS[d]}</option>
                ))}
              </select>
            </div>
          </div>
          {conflict && showModal && (
            <ConflictModal
              conflict={conflict}
              onClose={() => setShowModal(false)}
              onProceed={() => setShowModal(false)}
            />
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Book Venue"}
          </button>
        </form>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search place..."
              className="border rounded px-3 py-2"
              value={filter.place}
              onChange={(e) => setFilter((f) => ({ ...f, place: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Distributor..."
              className="border rounded px-3 py-2"
              value={filter.distributor}
              onChange={(e) => setFilter((f) => ({ ...f, distributor: e.target.value }))}
            />
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filter.from}
              onChange={(e) => setFilter((f) => ({ ...f, from: e.target.value }))}
            />
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filter.to}
              onChange={(e) => setFilter((f) => ({ ...f, to: e.target.value }))}
            />
          </div>
          {/* Calendar view stub */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded p-4 text-center text-gray-500">Calendar view coming soon...</div>
          </div>
          <div className="grid gap-4">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 ${b.own ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-300"}`}
              >
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{b.place}</div>
                  <div className="mb-1">Distributor: <span className="font-semibold">{b.distributor}</span></div>
                  <div className="mb-1">Date: {b.date} | Time: {b.startTime}</div>
                  <div className="mb-1">Duration: {DURATION_LABELS[b.duration]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
