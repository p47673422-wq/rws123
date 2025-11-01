"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, Input, Button, Modal, message } from "antd";

interface Distributor {
  id: string;
  name: string;
  phone: string;
}

interface OrderData {
  distributor: string;
  books: string;
  qty: string;
}

interface PaymentData {
  distributor: string;
  amount: string;
  method: 'Cash' | 'UPI';
  status: 'VERIFIED';
}

const DISTRIBUTORS_API = "/api/ram/store/team";
const ORDERS_API = "/api/ram/store/orders";
const PAYMENTS_API = "/api/ram/store/payments";

export default function AssistedOrderPage() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : "store";
    if (role !== "store") router.replace("/store");
  }, []);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [books, setBooks] = useState<string>("");
  const [qty, setQty] = useState<string>("");
  const [collectPayment, setCollectPayment] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI'>("Cash");
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    fetch(DISTRIBUTORS_API)
      .then((res) => res.json())
      .then((data) => setDistributors(data));
  }, []);

  async function handleSubmit() {
    // Create order
    const orderData: OrderData = {
      distributor: selectedDistributor!,
      books,
      qty
    };

    await fetch(ORDERS_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (collectPayment) {
      const paymentData: PaymentData = {
        distributor: selectedDistributor!,
        amount,
        method: paymentMethod,
        status: "VERIFIED"
      };

      await fetch(PAYMENTS_API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
    }
    message.success("Order created and inventory updated!");
    setModal(true);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Select
          placeholder="Select Distributor"
          style={{ width: 240 }}
          value={selectedDistributor}
          onChange={setSelectedDistributor}
        >
          {distributors.map((d) => (
            <Select.Option key={d.name} value={d.name}>{d.name}</Select.Option>
          ))}
        </Select>
      </div>
      <div className="mb-4">
  <Input placeholder="Books (comma separated)" value={books} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBooks(e.target.value)} style={{ width: 240, marginRight: 12 }} />
  <Input placeholder="Quantity" value={qty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQty(e.target.value)} style={{ width: 120 }} />
      </div>
      <div className="mb-4">
        <label>
          <input type="checkbox" checked={collectPayment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollectPayment(e.target.checked)} /> Collect payment now?
        </label>
      </div>
      {collectPayment && (
        <div className="mb-4">
          <Input placeholder="Amount" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} style={{ width: 120, marginRight: 12 }} />
          <Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: 120 }}>
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="UPI">UPI</Select.Option>
          </Select>
        </div>
      )}
      <Button type="primary" onClick={handleSubmit}>Submit Order</Button>
      <Button className="ml-4" onClick={handlePrint}>Print Receipt</Button>
      <Modal visible={modal} title="Receipt" onCancel={() => setModal(false)} footer={null}>
        <div>
          <div>Distributor: {selectedDistributor}</div>
          <div>Books: {books}</div>
          <div>Quantity: {qty}</div>
          {collectPayment && <div>Amount: ₹{amount} ({paymentMethod})</div>}
        </div>
        <Button type="primary" className="mt-4" onClick={handlePrint}>Print</Button>
      </Modal>
    </div>
  );
}
