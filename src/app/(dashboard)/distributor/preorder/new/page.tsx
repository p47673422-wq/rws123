"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import Select from '../../../../../components/ui/Select';
import Card from '../../../../../components/ui/Card';
import { Plus, Trash2, Check, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

type Book = { id: string; title: string; price: number; languages: string[] };

type Item = {
  id: string;
  bookId?: string | null;
  book?: Book | null;
  language?: string | null;
  qty: number;
};

export default function NewPreorderPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([{ id: String(Date.now()), qty: 1 }]);
  const [query, setQuery] = useState('');
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (!query) return setBookResults([]);
      setLoadingBooks(true);
      fetch(`/api/books?search=${encodeURIComponent(query)}`)
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then((data: any[]) => {
          // map to Book
          const mapped = (data || []).map(b => ({ id: String(b.id), title: b.title || b.name || b.label, price: b.price || 0, languages: b.languages || [] }));
          setBookResults(mapped);
        })
        .catch(() => setBookResults([]))
        .finally(() => setLoadingBooks(false));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  function updateItem(id: string, patch: Partial<Item>) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  }

  function addItem() {
    setItems(prev => [...prev, { id: String(Date.now()), qty: 1 }]);
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(it => it.id !== id));
  }

  const total = useMemo(() => items.reduce((s, it) => s + ((it.book?.price || 0) * (it.qty || 0)), 0), [items]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    // validation
    if (items.length === 0) return alert('Add at least one book');
    for (const it of items) {
      if (!it.bookId) return alert('Please select a book for all rows');
      if (!it.qty || it.qty <= 0) return alert('Quantity must be greater than 0');
    }

    setSubmitting(true);
    try {
      const payload = { items: items.map(i => ({ bookId: i.bookId, language: i.language, qty: i.qty })) };
      const res = await fetch('/api/ram/distributor/preorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed');
      setSuccess(true);
      setTimeout(() => router.push('/distributor/orders'), 1200);
    } catch (err) {
      alert('Failed to create pre-order');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-krishna-blue mb-4">Create Pre-Order</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.06 }}>
          {items.map((it, idx) => (
            <Card key={it.id}>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                <div className="sm:col-span-5">
                  <label className="text-sm text-gray-700">Book</label>
                  <Select
                    options={bookResults.map(b => ({ value: b.id, label: `${b.title} — ₹${b.price}` }))}
                    value={it.bookId || null}
                    onChange={(v: string) => {
                      const b = bookResults.find(bk => bk.id === v);
                      updateItem(it.id, { bookId: v, book: b || null, language: b?.languages?.[0] || null });
                    }}
                    placeholder={loadingBooks ? 'Searching…' : 'Search book by title'}
                    label="Book"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-sm text-gray-700">Language</label>
                  <Select
                    options={(it.book?.languages || []).map(l => ({ value: l, label: l }))}
                    value={it.language || null}
                    onChange={(v: string) => updateItem(it.id, { language: v })}
                    placeholder="Select language"
                    label="Language"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700">Quantity</label>
                  <Input type="number" min={1} value={it.qty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(it.id, { qty: Number(e.target.value) })} />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => removeItem(it.id)} aria-label="Remove" className="p-2 rounded bg-red-50 text-red-600"><Trash2 /></button>
                </div>

                {it.book && (
                  <div className="sm:col-span-12 mt-2 text-sm text-gray-600">
                    Price: ₹{it.book.price} • Languages: {it.book.languages.join(', ')}
                  </div>
                )}
              </div>
            </Card>
          ))}

          <div className="flex gap-3">
            <Button type="button" onClick={addItem}><Plus /> <span className="ml-2">Add Another Book</span></Button>
            <div className="flex-1" />
            <div className="text-sm text-gray-700 self-center">Total: <span className="font-bold">₹ {total}</span></div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" variant="primary">{submitting ? 'Creating…' : <><ShoppingCart className="inline mr-2"/> Create Pre-Order</>}</Button>
          </div>
        </motion.div>
      </form>

      {success && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl flex flex-col items-center gap-3">
            <Check className="text-green-600" />
            <div className="font-semibold">Pre-order created</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
