"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Tabs, Input, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, CheckCircleOutlined, CopyOutlined, FileExcelOutlined } from "@ant-design/icons";

interface Book {
  name: string;
  qty: number;
}

interface Order {
  id: string;
  distributor: string;
  books: Book[];
  amount: number;
  status: "Pending" | "Packed" | "Collected";
  otp?: string;
}

// API endpoint
const ORDERS_API = "/api/ram/store/orders";

const statusTabs = ["All", "Pending", "Packed", "Collected"];

export default function StoreOrdersPage() {
  const [activeTab, setActiveTab] = useState<typeof statusTabs[number]>("All");
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [otpModal, setOtpModal] = useState<{ visible: boolean; order: Order | null }>({ visible: false, order: null });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    setLoading(true);
    fetch(ORDERS_API)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((o) =>
    (activeTab === "All" || o.status === activeTab) &&
    (o.distributor.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  // Columns
  const columns = [
  { title: "Order ID", dataIndex: "id", sorter: (a: any, b: any) => a.id.localeCompare(b.id) },
  { title: "Distributor Name", dataIndex: "distributor", sorter: (a: any, b: any) => a.distributor.localeCompare(b.distributor) },
    {
      title: "Books",
      dataIndex: "books",
  render: (books: any[]) => (
        <ul>
          {books.map((b: any, idx: number) => (
            <li key={idx}>{b.name} ({b.qty})</li>
          ))}
        </ul>
      ),
    },
  { title: "Quantity", render: (record: any) => record.books.reduce((sum: number, b: any) => sum + b.qty, 0) },
  { title: "Amount", dataIndex: "amount", sorter: (a: any, b: any) => a.amount - b.amount },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
  render: (_: any, record: any) => {
        if (record.status === "Pending") {
          return (
            <span>
              <Button icon={<EditOutlined />} size="small" onClick={() => setEditingOrder(record)}>Edit Order</Button>
              <Button icon={<CheckCircleOutlined />} size="small" className="ml-2" onClick={() => handleMarkPacked(record)}>Mark as Packed</Button>
            </span>
          );
        }
        if (record.status === "Packed") {
          return (
            <span>
              <Button icon={<CopyOutlined />} size="small" onClick={() => handleCopyOtp(record)}>{record.otp}</Button>
              <Input placeholder="Enter OTP" style={{ width: 100, marginLeft: 8 }} onPressEnter={(e: any) => handleOtpSubmit(record, e.target.value)} />
              <Button type="primary" size="small" className="ml-2" onClick={() => setOtpModal({ visible: true, order: record })}>Confirm Collection</Button>
            </span>
          );
        }
        if (record.status === "Collected") {
          return <span className="text-green-600 font-bold">Collected</span>;
        }
        return null;
      },
    },
  ];

  // Mark as packed
  async function handleMarkPacked(order: any) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setLoading(true);
    await fetch(ORDERS_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status: "Packed", otp }),
    });
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "Packed", otp } : o));
    setLoading(false);
    message.success(`Order marked as Packed. OTP: ${otp}`);
  }

  // Copy OTP
  function handleCopyOtp(order: any) {
    navigator.clipboard.writeText(order.otp);
    message.success("OTP copied!");
  }

  // OTP submit
  async function handleOtpSubmit(order: any, value: string) {
    if (value === order.otp) {
      setLoading(true);
      await fetch(ORDERS_API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: "Collected" }),
      });
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "Collected" } : o));
      setLoading(false);
      message.success("Order collected and inventory updated!");
    } else {
      message.error("Invalid OTP!");
    }
  }

  // Export to CSV
  function handleExportCSV() {
    // Simple CSV export
    const csv = [
      ["Order ID", "Distributor", "Books", "Quantity", "Amount", "Status"],
      ...orders.map((o) => [
        o.id,
        o.distributor,
        o.books.map((b) => `${b.name} (${b.qty})`).join(", "),
        o.books.reduce((sum, b) => sum + b.qty, 0),
        o.amount,
        o.status,
      ]),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={statusTabs.map((tab) => ({ key: tab, label: tab }))}
        />
        <Input
          placeholder="Search orders..."
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button icon={<FileExcelOutlined />} onClick={handleExportCSV}>Export to CSV</Button>
      </div>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="hover-table"
        loading={loading}
      />
      {/* Inline Edit Modal */}
      <Modal
        visible={!!editingOrder}
        title="Edit Order"
        onCancel={() => setEditingOrder(null)}
        onOk={() => setEditingOrder(null)}
      >
        <div>Inline editing UI here (books/quantities)</div>
      </Modal>
      {/* OTP Modal */}
      <Modal
        visible={otpModal.visible}
        title="Confirm Collection"
        onCancel={() => setOtpModal({ visible: false, order: null })}
        onOk={() => setOtpModal({ visible: false, order: null })}
      >
        <div>Enter OTP to confirm collection for order {otpModal.order?.id}</div>
      </Modal>
      <style jsx>{`
        .hover-table :global(.ant-table-row):hover {
          background: #f0f6ff;
        }
      `}</style>
    </div>
  );
}
