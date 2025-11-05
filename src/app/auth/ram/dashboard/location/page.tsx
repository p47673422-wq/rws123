"use client";
import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Venue {
  id: string;
  place: string;
  date: string;
  startTime: string;
  durationMins: number;
  distributor?: { id: string; name: string; phone?: string } | null;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'place' | 'distributor'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [groupBy, setGroupBy] = useState<'none' | 'place' | 'date'>('none');

  // fetch list
  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (placeFilter) params.set('place', placeFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);
      params.set('limit', '500');

      const res = await fetch(`/api/ram/venues?${params.toString()}`);
      const body = await res.json();
      if (body.error) {
        setError(body.error);
        setVenues([]);
      } else {
        setVenues((body.data || []) as Venue[]);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch venues');
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [search, placeFilter, dateFrom, dateTo, sortBy, sortDir]);

  // derive unique places for the filter dropdown
  const places = useMemo(() => {
    const s = new Set<string>();
    venues.forEach(v => { if (v.place) s.add(v.place); });
    return Array.from(s).sort();
  }, [venues]);

  // grouping
  const grouped = useMemo(() => {
    if (groupBy === 'none') return null;
    const map = new Map<string, Venue[]>();
    venues.forEach(v => {
      let key = '';
      if (groupBy === 'place') key = v.place || 'Unknown';
      if (groupBy === 'date') key = new Date(v.date).toLocaleDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    });
    return Array.from(map.entries());
  }, [venues, groupBy]);

  return (
    <DashboardLayout user={{ name: 'Loading...' }}>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Venues / Locations</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              placeholder="Search place..."
              className="p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="p-2 border rounded" value={placeFilter} onChange={(e) => setPlaceFilter(e.target.value)}>
              <option value="">All places</option>
              {places.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <div className="flex gap-2">
              <input type="date" className="p-2 border rounded" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <input type="date" className="p-2 border rounded" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Sort:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="p-2 border rounded">
                <option value="date">Date</option>
                <option value="place">Place</option>
                <option value="distributor">Distributor</option>
              </select>
              <select value={sortDir} onChange={(e) => setSortDir(e.target.value as any)} className="p-2 border rounded">
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>

              <label className="text-sm ml-4">Group by:</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)} className="p-2 border rounded">
                <option value="none">None</option>
                <option value="place">Place</option>
                <option value="date">Date</option>
              </select>
            </div>

            <div>
              <button onClick={() => fetchVenues()} className="px-3 py-2 bg-pink-600 text-white rounded">Refresh</button>
            </div>
          </div>

          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {!loading && venues.length === 0 && (
            <div className="text-center text-gray-500 py-8">No venues found.</div>
          )}

          {!loading && venues.length > 0 && (
            <div>
              {grouped ? (
                grouped.map(([key, items]) => (
                  <div key={key} className="mb-6">
                    <h4 className="font-semibold text-pink-700 mb-2">{key} ({items.length})</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600">
                            <th className="p-2">Place</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Start</th>
                            <th className="p-2">Duration (mins)</th>
                            <th className="p-2">Distributor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(v => (
                            <tr key={v.id} className="border-t">
                              <td className="p-2">{v.place}</td>
                              <td className="p-2">{new Date(v.date).toLocaleDateString()}</td>
                              <td className="p-2">{new Date(v.startTime).toLocaleTimeString()}</td>
                              <td className="p-2">{v.durationMins}</td>
                              <td className="p-2">{v.distributor?.name || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="p-2">Place</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Start</th>
                        <th className="p-2">Duration (mins)</th>
                        <th className="p-2">Distributor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venues.map(v => (
                        <tr key={v.id} className="border-t">
                          <td className="p-2">{v.place}</td>
                          <td className="p-2">{new Date(v.date).toLocaleDateString()}</td>
                          <td className="p-2">{new Date(v.startTime).toLocaleTimeString()}</td>
                          <td className="p-2">{v.durationMins}</td>
                          <td className="p-2">{v.distributor?.name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}