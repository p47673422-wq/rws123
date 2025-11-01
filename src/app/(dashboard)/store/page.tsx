"use client";
import React from "react";
import { Card, Table, Button, Modal } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Dummy data for metrics
const metrics = [
  { title: "Pending Orders", value: 12 },
  { title: "Pending Payments", value: 5 },
  { title: "Total Inventory", value: 320 },
  { title: "Active Distributors", value: 8 },
];

// Dummy data for recent orders
const recentOrders = [
  { id: "ORD001", distributor: "Amit", books: "BG, SSR", qty: 10, amount: 1200, status: "Pending" },
  { id: "ORD002", distributor: "Sita", books: "TTM", qty: 5, amount: 600, status: "Packed" },
];

// Dummy data for payment verifications
const payments = [
  { id: 1, distributor: "Amit", amount: 1200, image: "/public/iskcon-logo.png", books: "BG, SSR", date: "2025-10-25" },
  { id: 2, distributor: "Sita", amount: 600, image: "/public/iskcon-logo.png", books: "TTM", date: "2025-10-24" },
];

// Dummy chart data
const ordersChart = [
  { date: "Oct 20", orders: 5 },
  { date: "Oct 21", orders: 8 },
  { date: "Oct 22", orders: 6 },
  { date: "Oct 23", orders: 10 },
  { date: "Oct 24", orders: 7 },
];

// Dummy top distributors
const topDistributors = [
  { name: "Amit", score: 120 },
  { name: "Sita", score: 110 },
  { name: "Ram", score: 100 },
];

export default function StoreDashboard() {
  return (
    <div className="p-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {metrics.map((m) => (
          <Card key={m.title} className="shadow-lg hover:shadow-xl transition-all">
            <div className="text-lg font-semibold mb-2">{m.title}</div>
            <div className="text-3xl font-bold text-blue-600">{m.value}</div>
          </Card>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Recent Orders Table */}
        <div>
          <div className="text-xl font-bold mb-4">Recent Orders</div>
          <Table
            dataSource={recentOrders}
            columns={[
              { title: "Order ID", dataIndex: "id" },
              { title: "Distributor", dataIndex: "distributor" },
              { title: "Books", dataIndex: "books" },
              { title: "Qty", dataIndex: "qty" },
              { title: "Amount", dataIndex: "amount" },
              { title: "Status", dataIndex: "status" },
              {
                title: "Actions",
                render: (_, record) => (
                  <Button type="primary" size="small">Quick Action</Button>
                ),
              },
            ]}
            rowKey="id"
            pagination={false}
            className="hover-table"
          />
        </div>
        {/* Payment Verifications */}
        <div>
          <div className="text-xl font-bold mb-4">Pending Payment Verifications</div>
          <div className="grid grid-cols-1 gap-4">
            {payments.map((p) => (
              <Card key={p.id} className="flex items-center gap-4 shadow-md hover:shadow-lg">
                <img src={p.image} alt="Receipt" className="w-16 h-16 object-contain rounded" />
                <div>
                  <div className="font-semibold">{p.distributor}</div>
                  <div className="text-lg font-bold text-green-600">₹{p.amount}</div>
                  <div className="text-sm">Books: {p.books}</div>
                  <div className="text-xs text-gray-500">Submitted: {p.date}</div>
                </div>
                <Button type="primary" className="ml-auto">Verify</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Chart & Top Distributors */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="text-xl font-bold mb-4">Orders Over Time</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersChart}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="text-xl font-bold mb-4">Top Distributors</div>
          <ul className="space-y-2">
            {topDistributors.map((d) => (
              <li key={d.name} className="bg-white rounded shadow p-4 flex justify-between items-center hover:bg-blue-50">
                <span className="font-semibold">{d.name}</span>
                <span className="text-blue-600 font-bold">{d.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .hover-table :global(.ant-table-row):hover {
          background: #f0f6ff;
        }
      `}</style>
    </div>
  );
}
