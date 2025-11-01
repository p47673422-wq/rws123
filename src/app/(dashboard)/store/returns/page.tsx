"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Tag, message } from "antd";

const RETURNS_API = "/api/ram/store/returns";

export default function StoreReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingReturn, setEditingReturn] = useState<any | null>(null);
  const [reasonModal, setReasonModal] = useState<{ visible: boolean; returnId: string | null }>({ visible: false, returnId: null });

  useEffect(() => {
    setLoading(true);
    fetch(RETURNS_API)
      .then((res) => res.json())
      .then((data) => setReturns(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleAccept(returnReq: any) {
    setLoading(true);
    await fetch(RETURNS_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: returnReq.id, status: "Accepted" }),
    });
    setReturns((prev) => prev.map((r) => r.id === returnReq.id ? { ...r, status: "Accepted" } : r));
    setLoading(false);
    message.success("Return accepted, inventory updated!");
  }

  async function handleReject(returnReq: any, reason: string) {
    setLoading(true);
    await fetch(RETURNS_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: returnReq.id, status: "Rejected", reason }),
    });
    setReturns((prev) => prev.map((r) => r.id === returnReq.id ? { ...r, status: "Rejected", reason } : r));
    setLoading(false);
    message.error("Return rejected and distributor notified.");
  }

  const columns = [
    { title: "Return ID", dataIndex: "id" },
    { title: "Distributor", dataIndex: "distributor" },
    { title: "Books", dataIndex: "books", render: (books: any[]) => (
      <ul>{books.map((b, idx) => <li key={idx}>{b.name} ({b.qty})</li>)}</ul>
    ) },
    { title: "Reason", dataIndex: "reason" },
    { title: "Status", dataIndex: "status", render: (status: string) => <Tag color={status === "Accepted" ? "green" : status === "Rejected" ? "red" : "orange"}>{status}</Tag> },
    {
      title: "Actions",
      render: (_: any, record: any) => {
        if (record.status === "Pending") {
          return (
            <span>
              <Button size="small" onClick={() => setEditingReturn(record)}>Edit Items</Button>
              <Button size="small" className="ml-2" onClick={() => handleAccept(record)}>Accept Return</Button>
              <Button size="small" className="ml-2" onClick={() => setReasonModal({ visible: true, returnId: record.id })}>Reject Return</Button>
            </span>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="p-8">
      <Table
        dataSource={returns}
        columns={columns}
        rowKey="id"
        loading={loading}
        expandable={{ expandedRowRender: (record) => <div>Reason: {record.reason}</div> }}
        className="hover-table"
      />
      {/* Edit Items Modal */}
      <Modal
        visible={!!editingReturn}
        title="Edit Return Items"
        onCancel={() => setEditingReturn(null)}
        onOk={() => setEditingReturn(null)}
      >
        <div>Inline editing UI for items/quantities</div>
      </Modal>
      {/* Reject Reason Modal */}
      <Modal
        visible={reasonModal.visible}
        title="Reject Return"
        onCancel={() => setReasonModal({ visible: false, returnId: null })}
        onOk={() => {
          const reason = (document.getElementById("rejectReason") as HTMLInputElement)?.value || "";
          const returnReq = returns.find(r => r.id === reasonModal.returnId);
          if (returnReq) handleReject(returnReq, reason);
          setReasonModal({ visible: false, returnId: null });
        }}
      >
        <Input.TextArea id="rejectReason" rows={3} placeholder="Enter rejection reason..." />
      </Modal>
      <style jsx>{`
        .hover-table :global(.ant-table-row):hover {
          background: #f0f6ff;
        }
      `}</style>
    </div>
  );
}
