"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Badge, Collapse, message } from "antd";

const INVENTORY_API = "/api/ram/store/inventory";
const reasons = ["New Stock Arrival", "Return", "Correction"];

export default function StoreInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<{ visible: boolean }>({ visible: false });
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(INVENTORY_API)
      .then((res) => res.json())
      .then((data) => {
        setInventory(data.inventory);
        setHistory(data.history);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleUpdateStock() {
    setModal({ visible: true });
  }

  function handleSubmitStock() {
    setModal({ visible: false });
    message.success("Stock updated and transaction logged!");
  }

  function handleExport() {
    message.success("Inventory report exported!");
  }

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6">
        <Button type="primary" onClick={handleUpdateStock}>Update Stock</Button>
        <Button onClick={handleExport}>Export Inventory Report</Button>
      </div>
      <Table
        dataSource={inventory}
        rowKey="id"
        loading={loading}
        columns={[{
          title: "Book", dataIndex: "book"
        },
        { title: "Language", dataIndex: "language" },
        { title: "Quantity", dataIndex: "quantity", render: (qty: number) => qty < 10 ? <Badge color="red" text={qty + " (Low)"} /> : qty },
        { title: "Last Updated", dataIndex: "lastUpdated" },
        { title: "Actions", render: (_: any, record: any) => <Button size="small">View History</Button> }]
        }
        pagination={{ pageSize: 8 }}
        className="hover-table"
      />
      <Collapse className="mt-8">
        <Collapse.Panel header="Stock History" key="1">
          <Table
            dataSource={history}
            rowKey="date"
            columns={[{
              title: "Date", dataIndex: "date" },
              { title: "Book", dataIndex: "book" },
              { title: "Change", dataIndex: "change" },
              { title: "Reason", dataIndex: "reason" },
              { title: "Updated By", dataIndex: "updatedBy" }]
            }
            pagination={false}
            size="small"
          />
        </Collapse.Panel>
      </Collapse>
      <Modal
        visible={modal.visible}
        title="Update Stock"
        onCancel={() => setModal({ visible: false })}
        onOk={handleSubmitStock}
      >
        <Select placeholder="Select Book" style={{ width: "100%", marginBottom: 12 }}>
          <Select.Option value="BG">BG</Select.Option>
          <Select.Option value="SSR">SSR</Select.Option>
        </Select>
        <Input type="number" placeholder="Quantity to add" style={{ width: "100%", marginBottom: 12 }} />
        <Select placeholder="Reason" style={{ width: "100%", marginBottom: 12 }}>
          {reasons.map((r) => <Select.Option key={r} value={r}>{r}</Select.Option>)}
        </Select>
        <Input.TextArea rows={3} placeholder="Notes" style={{ width: "100%" }} />
      </Modal>
      <style jsx>{`
        .hover-table :global(.ant-table-row):hover {
          background: #f0f6ff;
        }
      `}</style>
    </div>
  );
}
