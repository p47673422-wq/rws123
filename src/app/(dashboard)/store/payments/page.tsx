import React from "react";
import { Card, Button, Modal, Input, Select } from "antd";

// Dummy payment data
const payments = [
  {
    id: 1,
    distributor: "Amit",
    avatar: "/public/iskcon-logo.png",
    amount: 1200,
    image: "/public/iskcon-logo.png",
    books: [{ name: "BG", qty: 5 }, { name: "SSR", qty: 5 }],
    date: "2025-10-25",
    status: "Pending",
  },
  {
    id: 2,
    distributor: "Sita",
    avatar: "/public/iskcon-logo.png",
    amount: 600,
    image: "/public/iskcon-logo.png",
    books: [{ name: "TTM", qty: 5 }],
    date: "2025-10-24",
    status: "Pending",
  },
];

const statusOptions = ["Pending", "Verified", "Rejected"];

export default function StorePaymentsPage() {
  const [filter, setFilter] = React.useState("Pending");
  const [search, setSearch] = React.useState("");
  const [modal, setModal] = React.useState({ visible: false, image: "" });
  const [reasonModal, setReasonModal] = React.useState({ visible: false, payment: null });

  const filteredPayments = payments.filter(
    (p) => (filter === "All" || p.status === filter) && p.distributor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6">
        <Select value={filter} onChange={setFilter} style={{ width: 140 }}>
          {statusOptions.map((s) => (
            <Select.Option key={s} value={s}>{s}</Select.Option>
          ))}
        </Select>
  <Input placeholder="Search by distributor..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} style={{ width: 220 }} />
      </div>
      <div className="grid grid-cols-2 gap-8">
        {filteredPayments.map((p) => (
          <Card key={p.id} className="shadow-lg hover:shadow-xl">
            <div className="flex items-center gap-4">
              <img src={p.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-bold text-lg">{p.distributor}</div>
                <div className="text-2xl font-bold text-green-600">₹{p.amount}</div>
                <div className="text-sm">Books: {p.books.map(b => `${b.name} (${b.qty})`).join(", ")}</div>
                <div className="text-xs text-gray-500">Submitted: {p.date}</div>
              </div>
            </div>
            <img src={p.image} alt="receipt" className="w-full h-32 object-contain mt-4 cursor-pointer" onClick={() => setModal({ visible: true, image: p.image })} />
            <div className="flex gap-2 mt-4">
              <Button type="primary">Verify</Button>
              <Button danger onClick={() => setReasonModal({ visible: true, payment: p as any })}>Reject</Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal visible={modal.visible} footer={null} onCancel={() => setModal({ visible: false, image: "" })}>
        <img src={modal.image} alt="receipt" style={{ width: "100%" }} />
      </Modal>
      <Modal visible={reasonModal.visible} title="Reject Payment" onCancel={() => setReasonModal({ visible: false, payment: null })} onOk={() => setReasonModal({ visible: false, payment: null })}>
        <Input.TextArea rows={4} placeholder="Enter rejection reason..." />
      </Modal>
    </div>
  );
}
