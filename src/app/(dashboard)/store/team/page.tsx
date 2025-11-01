"use client";
import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";

// Dummy team data
const team = [
  { name: "Amit", phone: "9876543210", role: "Distributor", joinDate: "2024-01-10", status: "Active" },
  { name: "Sita", phone: "9876543211", role: "Distributor", joinDate: "2024-03-15", status: "Inactive" },
];

export default function StoreTeamPage() {
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState<{ visible: boolean; member: any | null }>({ visible: false, member: null });

  const filteredTeam = team.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  function handleExportCSV() {
    const csv = [
      ["Name", "Phone", "Role", "Join Date", "Status"],
      ...team.map((m) => [m.name, m.phone, m.role, m.joinDate, m.status]),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6">
  <Input placeholder="Search team..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} style={{ width: 220 }} />
        <Button onClick={handleExportCSV}>Export contact list</Button>
      </div>
      <Table
        dataSource={filteredTeam}
        columns={[{
          title: "Name", dataIndex: "name", render: (text: string, record: any) => <span className="cursor-pointer text-blue-600" onClick={() => setModal({ visible: true, member: record })}>{text}</span>
        },
        { title: "Phone", dataIndex: "phone" },
        { title: "Role", dataIndex: "role" },
        { title: "Join Date", dataIndex: "joinDate" },
        { title: "Status", dataIndex: "status" },
  { title: "Actions", render: (_: any, record: any) => <Button type="primary">Send Reminder</Button> }]
        }
        rowKey="phone"
        pagination={false}
        className="hover-table"
      />
      <Modal
        visible={modal.visible}
  title={(modal.member as any)?.name}
        onCancel={() => setModal({ visible: false, member: null })}
        footer={null}
      >
        <div>
          <div><b>Performance stats:</b> ...</div>
          <div><b>Recent orders:</b> ...</div>
          <div><b>Pending dues:</b> ...</div>
          <div><b>Payment history:</b> ...</div>
          <div><b>Inventory status:</b> ...</div>
          <Button type="primary" className="mt-4">Send Reminder</Button>
        </div>
      </Modal>
      <style jsx>{`
        .hover-table :global(.ant-table-row):hover {
          background: #f0f6ff;
        }
      `}</style>
    </div>
  );
}
