"use client";
import React, { useState } from "react";
import "../../../home-custom.css";
import "../../../../../globals.css";
import "../purchase-items.css";

const books = [
	{
		id: 1,
		title: "Bhagavad Gita As It Is",
		desc: "The timeless wisdom of Krishna, translated and explained by Srila Prabhupada.",
		price: 250,
		img: "/images/BG.jpg", // Bhagavad Gita cover
	},
	{
		id: 2,
		title: "Science of Self Realization",
		desc: "A collection of essays and interviews on the science of the soul.",
		price: 180,
		img: "https://i0.wp.com/iskconshop.com/wp-content/uploads/2021/05/91jfYQBQXLL._SY466_.jpg?w=288&ssl=1", // Science of Self Realization book
	},
	{
		id: 3,
		title: "Krishna Book",
		desc: "Stories of Krishna's pastimes in Vrindavan.",
		price: 300,
		img: "https://i0.wp.com/iskconshop.com/wp-content/uploads/2021/05/125-1-1-1.png?resize=1000%2C1000&ssl=1", // Krishna Book cover
	},
];

const articles = [
	{
		id: 101,
		title: "Tulsi Mala",
		desc: "Sacred tulsi beads for chanting and meditation.",
		price: 60,
		img: "https://i0.wp.com/iskconshop.com/wp-content/uploads/2023/11/394A9355-1.jpg?resize=1000%2C1000&ssl=1", // Tulsi Mala
	},
	{
		id: 102,
		title: "Incense Pack",
		desc: "Fragrant incense sticks for your altar.",
		price: 40,
		img: "https://i0.wp.com/iskconshop.com/wp-content/uploads/2021/05/25-3-2-1-1-1-1-1.png?resize=1000%2C1000&ssl=1", // Incense sticks
	},
	{
		id: 103,
		title: "Car Hanging – Jagannath, Yasoda Damodara, Radha Madhav",
		desc: "Traditional car hanging for your vechicle",
		price: 120,
		img: "https://i0.wp.com/iskconshop.com/wp-content/uploads/2021/08/18-e1685904463996.png?resize=1024%2C1024&ssl=1", // Aarti plate
	},
];

export default function DivinePurchasePage() {
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
			window.location.href = "/home/8ps/purchase/cart-summary";
		}

	return (
		<div className="comeCustomBox1">
			<div className="purchase-main-box-dark">
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
// CSS for cart-qty-row and qty-btn should be added to your CSS file for proper styling.
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
