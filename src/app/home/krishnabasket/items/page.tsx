"use client";
import React, { useState } from "react";
import "../../home-custom.css";
import "../../../../globals.css";
import "../purchase-items.css";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useRouter} from "next/navigation";

const books = [
    {
        id: 1,
        title: "Gita Kit",
        desc: "Contains bhagavad gita, japa mala, japa bag, certificate, frame, keychain, pen andcookie packet",
        price: 500,
        img: "/images/BG.jpg", // Bhagavad Gita cover
    },
    {
        id: 2,
        title: "Shiksha Kit",
        desc: "Contains Science of Self Realization, japa mala, japa bag, certificate, frame, keychain andpen",
        price: 200,
        img: "/images/SSR.jpg", // Science of Self Realization book
    },
    {
        id: 3,
        title: "Krishna Kit",
        desc: "Contains Krishna book, japa mala, japa bag, certificate, frame, keychain, pen and cookie packet",
        price: 500,
        img: "/images/KRSNA.jpg", // Krishna Book cover
    },
    {
        id: 4,
        title: "Dharma Kit",
        desc: "Contains Dharma book, japa mala, japa bag, certificate, frame and keychain",
        price: 100,
        img: "/images/Dharma.jpg", // Dharma Book cover
    },
    {
        id: 5,
        title: "Prahlad Kit",
        desc: "Contains Prahlad book, japa mala, japa bag, certificate and frame",
        price: 50,
        img: "/images/TTM.png", // Prahlad Book cover
    },
];

const articles = [
    {
        id: 101,
        title: "Special Bead Bag",
        desc: "A beautiful bag to carry your japa beads.",
        price: 80,
        img: "https://i0.wp.com/iskconshop.com/wp-content/uploads/2023/11/394A9355-1.jpg?resize=1000%2C1000&ssl=1", // Special Bead Bag
    }
];

export default function DivinePurchasePage() {
    const router = useRouter();
    const [tab, setTab] = useState<"books" | "articles">("books");
    // Single cartItems state for all cart logic
    const [cartItems, setCartItems] = useState<{
        id: number;
        title: string;
        price: number;
        qty: number;
    }[]>([]);
    const items = tab === "books" ? books : articles;

    function addToCart(item: typeof books[0]) {
        setCartItems((prev) => {
            const found = prev.find((c) => c.id === item.id);
            if (found) {
                return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
            }
            return [...prev, { id: item.id, title: item.title, price: item.price, qty: 1 }];
        });
    }
    function updateQty(id: number, qty: number) {
        setCartItems((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c)));
    }
    function removeFromCart(id: number) {
        setCartItems((prev) => prev.filter((c) => c.id !== id));
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

        function handleCheckout() {
            // Store cart in localStorage and redirect to cart summary page
            localStorage.setItem("cart", JSON.stringify(cartItems));
            window.location.href = "/home/krishnabasket/cart-summary";
        }

    return (
        <div className="comeCustomBox1">
            <div className="purchase-main-box-dark">
                <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
                <h2 className="fancyTitle">Divine Purchase</h2>
                <div className="flex justify-center gap-6">
                    <button
                        className={`fancy-btn${tab === "books" ? " active" : ""}`}
                        onClick={() => setTab("books")}
                    >
                        Books
                    </button>
                    <button
                        className={`fancy-btn${tab === "articles" ? " active" : ""}`}
                        onClick={() => setTab("articles")}
                    >
                        Articles
                    </button>
                </div>
                <div className="purchase-items-grid">
                    {items.map((item) => (
                        <div key={item.id} className="purchase-card-dark">
                            <div className="purchase-img-wrap-dark">
                                <img src={item.img} alt={item.title} className="purchase-img" />
                            </div>
                            <div className="purchase-card-content">
                                <div className="purchase-title">{item.title}</div>
                                <div className="purchase-desc">{item.desc}</div>
                                <div className="purchase-price">₹{item.price}</div>
                                                <div className="cart-qty-row">
                                                    <button
                                                        className="qty-btn"
                                                        type="button"
                                                                                    onClick={() => {
                                                                                        const found = cartItems.find((c) => c.id === item.id);
                                                                                        if (found) {
                                                                                            if (found.qty === 1) removeFromCart(item.id);
                                                                                            else updateQty(item.id, found.qty - 1);
                                                                                        }
                                                                                    }}
                                                                                    disabled={!cartItems.find((c) => c.id === item.id)}
                                                    >
                                                        –
                                                    </button>
                                                    <span className="cart-qty-value">
                                                        {cartItems.find((c) => c.id === item.id)?.qty || 0}
                                                    </span>
                                                    <button
                                                        className="qty-btn"
                                                        type="button"
                                                        onClick={() => {
                                                            const found = cartItems.find((c) => c.id === item.id);
                                                            if (found) updateQty(item.id, found.qty + 1);
                                                            else addToCart(item);
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                    <button className="fancy-btn add-to-cart-btn" onClick={() => addToCart(item)}>
                                                        Add to Cart
                                                    </button>
                                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="checkout-bar">
                    <div className="checkout-total">Total: ₹{total}</div>
                    <button
                        className="fancy-btn proceed-checkout-btn"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
