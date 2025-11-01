"use client";
import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Input, Checkbox, Tag, Select, message } from "antd";

interface Due {
  id: string;
  name: string;
  pendingAmount: number;
  lastPaymentDate: string;
  daysOverdue: number;
}

type FilterType = "All" | "Overdue Only" | "High Amount (>₹5000)";

const DUES_API = "/api/ram/store/dues";
const summaryCards = ["Total Pending", "Overdue", "Collected This Month"] as const;
const filters: FilterType[] = ["All", "Overdue Only", "High Amount (>₹5000)"];

export default function StoreDuesPage() {
  const [dues, setDues] = useState<Due[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState<{ visible: boolean; due: Due | null }>({ visible: false, due: null });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch(DUES_API)
      .then((res) => res.json())
      .then((data) => setDues(data))
      .finally(() => setLoading(false));
  }, []);

  // Filtered dues
  let filteredDues = dues.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === "Overdue Only") filteredDues = filteredDues.filter((d) => d.daysOverdue > 0);
  if (filter === "High Amount (>₹5000)") filteredDues = filteredDues.filter((d) => d.pendingAmount > 5000);

  // Row color
  function getRowColor(days: number) {
    if (days > 7) return "red";
    if (days > 0) return "orange";
    return "green";
  }

  // Bulk reminder
  function handleBulkReminder() {
    message.success("Reminder sent to selected distributors!");
  }

  return (
    <div className="p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {summaryCards.map((title) => (
          <Card key={title} className="shadow-lg">
            <div className="text-lg font-semibold mb-2">{title}</div>
            <div className="text-2xl font-bold text-blue-600">--</div>
          </Card>
        ))}
      </div>
      {/* Filters/Search */}
      <div className="flex gap-4 mb-4">
        <Select value={filter} onChange={setFilter} style={{ width: 180 }}>
          {filters.map((f) => (
            <Select.Option key={f} value={f}>{f}</Select.Option>
          ))}
        </Select>
  <Input placeholder="Search distributor..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} style={{ width: 220 }} />
        <Button disabled={selected.length === 0} onClick={handleBulkReminder}>Send Reminder to Selected</Button>
      </div>
      {/* Dues Table */}
      <Table
        dataSource={filteredDues}
        rowKey="name"
        loading={loading}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: (keys: React.Key[]) => setSelected(keys as string[]),
        }}
        columns={[{
          title: "Distributor Name", dataIndex: "name", sorter: (a: Due, b: Due) => a.name.localeCompare(b.name),
          render: (text: string, record: Due) => <span className="cursor-pointer text-blue-600" onClick={() => setModal({ visible: true, due: record })}>{text}</span>
        },
        { title: "Pending Amount", dataIndex: "pendingAmount", sorter: (a: Due, b: Due) => b.pendingAmount - a.pendingAmount },
        { title: "Last Payment Date", dataIndex: "lastPaymentDate" },
        { title: "Days Overdue", dataIndex: "daysOverdue", sorter: (a: Due, b: Due) => b.daysOverdue - a.daysOverdue,
          render: (days: number) => <Tag color={getRowColor(days)}>{days}</Tag>
        },
        { title: "Actions", render: (_: any, record: Due) => (
          <span>
            <Button size="small" onClick={() => setModal({ visible: true, due: record })}>View Details</Button>
            <Button size="small" className="ml-2">Send Reminder</Button>
            <Button size="small" className="ml-2">Record Payment</Button>
          </span>
        ) }]
        }
        pagination={{ pageSize: 8 }}
        className="hover-table"
      />
      {/* Details Modal */}
      <Modal
        visible={modal.visible}
        title={modal.due?.name}
        onCancel={() => setModal({ visible: false, due: null })}
        footer={null}
      >
        <div>Breakdown of dues, payments, reminders, etc.</div>
      </Modal>
      <style jsx>{`
        .hover-table :global(.ant-table-row):hover {
          background: #f0f6ff;
        }
      `}</style>
    </div>
  );
}
