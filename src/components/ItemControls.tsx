"use client";
import React from "react";

interface ItemControlsProps {
  itemId: number;
  cartItems: Array<{
    id: number;
    title: string;
    price: number;
    qty: number;
  }>;
  onAdd: () => void;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}

export function ItemControls({ itemId, cartItems, onAdd, onUpdate, onRemove }: ItemControlsProps) {
  const item = cartItems.find((c) => c.id === itemId);

  return (
    <div className="cart-qty-row">
      <button
        className="qty-btn"
        type="button"
        onClick={() => {
          if (item) {
            if (item.qty === 1) onRemove();
            else onUpdate(item.qty - 1);
          }
        }}
        disabled={!item}
      >
        –
      </button>
      <span className="cart-qty-value">
        {item?.qty || 0}
      </span>
      <button
        className="qty-btn"
        type="button"
        onClick={() => {
          if (item) onUpdate(item.qty + 1);
          else onAdd();
        }}
      >
        +
      </button>
      <button className="fancy-btn add-to-cart-btn" onClick={onAdd}>
        Add to Cart
      </button>
    </div>
  );
}