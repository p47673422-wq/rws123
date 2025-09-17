"use client";
import React, { useEffect, useState } from "react";
import FlipCard from "../../../../components/ui/FlipCard";
import GlowingInput from "../../../../components/ui/GlowingInput";
import GlowingButton from "../../../../components/ui/GlowingButton";
import GiftCard from "../../../../components/ui/GiftCard";
import { useLocalProfile } from "../../../../hooks/useLocalProfile";
import { motion, AnimatePresence } from "framer-motion";

const stories = [
	{
		text: "A devotee once offered a simple flower to the Lord with pure love. The Lord accepted it joyfully, teaching that devotion matters more than grandeur.",
		question: "What does this story teach about the nature of true offering?",
	},
	{
		text: "A child sang the holy names with innocence and joy, inspiring the whole congregation. The elders realized that sincerity is the heart of spiritual practice.",
		question: "How can sincerity transform spiritual activities?",
	},
	{
		text: "A king renounced his throne to serve the Lord, showing that spiritual wealth surpasses material riches.",
		question: "What is the real meaning of renunciation in this story?",
	},
	{
		text: "A devotee faced many hardships but never gave up chanting. Eventually, peace and happiness blossomed in their heart.",
		question: "How does perseverance in devotion help us overcome challenges?",
	},
];

const researchLinks = [
	{
		label: "Modern Science & Mantra Meditation (PDF)",
		url: "https://example.com/mantra-research.pdf",
	},
	{
		label: "Neuroscience of Devotion (PDF)",
		url: "https://example.com/devotion-neuro.pdf",
	},
];

export default function QuizLevel2Page() {
	const { profile, loading, error, refresh } = useLocalProfile();
	const [answers, setAnswers] = useState(["", "", "", ""]);
	const [step, setStep] = useState(0); // 0-3: stories, 4: research, 5: summary
	const [status, setStatus] = useState<
		"new" | "incomplete" | "locked" | "unlocked"
	>("new");
	const [gift, setGift] = useState<any>(null);
	const [message, setMessage] = useState("");
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [profileForm, setProfileForm] = useState({
		name: "",
		mobile: "",
		gender: "",
		address: "",
	});
	const [profileLoading, setProfileLoading] = useState(false);

	useEffect(() => {
		if (!profile) return;
		const level2Answers = profile.quizAnswers?.filter(
			(a: any) => a.level === 2
		) || [];
		const giftObj = profile.gifts?.find(
			(g: any) => g.level === 2 && g.type === "QUIZ"
		);
		if (level2Answers.length === 0) {
			setStatus("new");
			setAnswers(["", "", "", ""]);
		} else if (level2Answers.length < 4) {
			setStatus("incomplete");
			setAnswers(
				level2Answers
					.map((a: any) => a.answer)
					.concat(Array(4 - level2Answers.length).fill(""))
			);
			setMessage(
				"You started this quiz earlier 🌸 — please complete all stories to unlock your laddoo gift 🍬"
			);
		} else if (giftObj && !giftObj.unlocked) {
			setStatus("locked");
			setAnswers(level2Answers.map((a: any) => a.answer));
			setMessage("Complete all stories to unlock your laddoo gift.");
		} else if (giftObj && giftObj.unlocked) {
			setStatus("unlocked");
			setAnswers(level2Answers.map((a: any) => a.answer));
			setGift(giftObj);
			setStep(5); // Show summary directly
		}
	}, [profile]);

	const handleInput = (idx: number, value: string) => {
		setAnswers((a) => a.map((v, i) => (i === idx ? value : v)));
	};

	const handleNext = () => {
		if (step < 4) setStep(step + 1);
	};

	const handleSubmit = async () => {
		// Check profile
		let userProfile = profile;
		if (!userProfile) {
			// Try fetch
			const res = await fetch("/api/holyname/profile");
			if (res.ok) {
				userProfile = await res.json();
			}
		}
		if (!userProfile) {
			setShowProfileModal(true);
			return;
		}
		// Validate
		if (answers.some((a) => !a)) {
			setMessage("Please answer all stories to unlock your laddoo gift.");
			await fetch("/api/holyname/quiz/submit", {
				method: "POST",
				body: JSON.stringify({
					userId: userProfile.id,
					level: 2,
					answers: answers,
					isComplete: false,
				}),
				headers: { "Content-Type": "application/json" },
			});
			refresh();
			setStatus("locked");
			return;
		}
		// Save complete
		const res = await fetch("/api/holyname/quiz/submit", {
			method: "POST",
			body: JSON.stringify({
				userId: userProfile.id,
				level: 2,
				answers: answers,
				isComplete: true,
			}),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		if (data.gift?.unlocked) {
			setGift(data.gift);
			setStatus("unlocked");
			setMessage("Congratulations! You unlocked your laddoo gift.");
		} else {
			setStatus("locked");
			setMessage("Saved, but gift is locked.");
		}
		refresh();
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center text-red-600">
				{error}
			</div>
		);

	// Claim Gift Screen
	if (step === 5) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-200 via-white to-yellow-50 flex flex-col items-center py-8 px-2">
				{/* Back to Profile Button */}
				<div className="w-full flex justify-start mb-4">
					<a
						href="/holyname/profile"
						className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition"
					>
						← Back to Profile
					</a>
				</div>
				<h2 className="text-2xl font-bold text-orange-700 mb-4">Level 2 Gift</h2>
				{status === "unlocked" ? (
					<motion.div
						initial={{ scale: 0.8, opacity: 0.7 }}
						animate={{ scale: [1, 1.1, 1], boxShadow: "0 0 48px #fbbf24", opacity: 1 }}
						className="flex flex-col items-center gap-6"
					>
						<GiftCard unlocked name="Laddoo Gift" />
						<div className="mt-4">
							<h3 className="text-lg font-semibold text-orange-700">Your Answers:</h3>
							<ul className="mt-2 text-orange-900">
								{answers.map((a, i) => (
									<li key={i}>{a}</li>
								))}
							</ul>
						</div>
					</motion.div>
				) : null}
				{/* Research Step */}
				<h2 className="text-2xl font-bold text-orange-700 mb-4">Modern Research</h2>
				<div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 mb-6">
					<ul className="list-disc pl-6">
						{researchLinks.map((link, idx) => (
							<li key={idx}>
								<a
									href={link.url}
									target="_blank"
									rel="noopener"
									className="text-blue-600 underline"
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
				<GlowingButton onClick={handleSubmit}>Continue</GlowingButton>
				{/* Profile Modal */}
				{showProfileModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
						<div className="bg-white rounded-xl shadow-lg max-w-sm w-full relative">
							<div className="rounded-t-xl p-4 text-center font-bold text-white bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400" style={{ boxShadow: "0 0 24px #fbbf24" }}>
								Complete Your Profile
							</div>
							<form className="p-6 flex flex-col gap-4" onSubmit={async e => {
								e.preventDefault();
								setProfileLoading(true);
								const res = await fetch("/api/holyname/user/register", {
									method: "POST",
									body: JSON.stringify(profileForm),
									headers: { "Content-Type": "application/json" },
								});
								setProfileLoading(false);
								if (res.ok) {
									const data = await res.json();
									localStorage.setItem("mobile", profileForm.mobile);
									setShowProfileModal(false);
									setProfileForm({ name: "", mobile: "", gender: "", address: "" });
									setTimeout(() => {
										window.dispatchEvent(new CustomEvent("profileSaved"));
									}, 100);
									window.alert("🌸 Profile saved successfully!");
									handleSubmit(); // Retry original action
								}
							}}>
								<GlowingInput
									placeholder="Name"
									value={profileForm.name}
									onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
									required
									className="focus:ring-pink-400 shadow-pink-200"
								/>
								<GlowingInput
									placeholder="Mobile (unique)"
									value={profileForm.mobile}
									onChange={e => setProfileForm(f => ({ ...f, mobile: e.target.value }))}
									required
									className="focus:ring-pink-400 shadow-pink-200"
									type="tel"
								/>
								<GlowingInput
									placeholder="Gender"
									value={profileForm.gender}
									onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value }))}
									required
									className="focus:ring-pink-400 shadow-pink-200"
								/>
								<GlowingInput
									placeholder="Address"
									value={profileForm.address}
									onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))}
									required
									className="focus:ring-pink-400 shadow-pink-200"
								/>
								<GlowingButton type="submit" disabled={profileLoading} className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse">
									{profileLoading ? "Saving..." : "Save Profile"}
								</GlowingButton>
							</form>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Card Carousel for Stories
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-200 via-white to-yellow-50 flex flex-col items-center py-8 px-2">
			{/* Back to Profile Button */}
			<div className="w-full flex justify-start mb-4">
				<a
					href="/holyname/profile"
					className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition"
				>
					← Back to Profile
				</a>
			</div>
			<h2 className="text-2xl font-bold text-orange-700 mb-4">Level 2 Quiz</h2>
			<AnimatePresence initial={false}>
				<motion.div
					key={step}
					initial={{ x: 300, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -300, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="w-full max-w-xl flex flex-col items-center"
				>
					<div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full">
						<div
							className="text-lg font-semibold text-orange-700 mb-2"
							style={{ fontFamily: "serif" }}
						>
							{stories[step].text}
						</div>
						<GlowingInput
							type="text"
							value={answers[step]}
							onChange={(e) => handleInput(step, e.target.value)}
							placeholder={stories[step].question}
							required={
								status === "new" || status === "incomplete"
							}
						/>
					</div>
					<div className="flex justify-between w-full">
						{step > 0 && (
							<GlowingButton onClick={() => setStep(step - 1)}>
								Previous
							</GlowingButton>
						)}
						<GlowingButton onClick={handleNext}>
							{step < 3 ? "Next" : "Go to Research"}
						</GlowingButton>
					</div>
				</motion.div>
			</AnimatePresence>
			{message && (
				<div className="text-pink-600 font-semibold mt-4">{message}</div>
			)}
			{/* Profile Modal */}
			{showProfileModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-xl shadow-lg max-w-sm w-full relative">
						<div
							className="rounded-t-xl p-4 text-center font-bold text-white bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400"
							style={{ boxShadow: "0 0 24px #fbbf24" }}
						>
							Complete Your Profile
						</div>
						<form
							className="p-6 flex flex-col gap-4"
							onSubmit={async (e) => {
								e.preventDefault();
								setProfileLoading(true);
								const res = await fetch("/api/holyname/user/register", {
									method: "POST",
									body: JSON.stringify(profileForm),
									headers: { "Content-Type": "application/json" },
								});
								setProfileLoading(false);
								if (res.ok) {
									const data = await res.json();
									localStorage.setItem("mobile", profileForm.mobile);
									setShowProfileModal(false);
									setProfileForm({
										name: "",
										mobile: "",
										gender: "",
										address: "",
									});
									setTimeout(() => {
										window.dispatchEvent(new CustomEvent("profileSaved"));
									}, 100);
									window.alert("🌸 Profile saved successfully!");
									handleSubmit(); // Retry original action
								}
							}}
						>
							<GlowingInput
								placeholder="Name"
								value={profileForm.name}
								onChange={(e) =>
									setProfileForm((f) => ({ ...f, name: e.target.value }))
								}
								required
								className="focus:ring-pink-400 shadow-pink-200"
							/>
							<GlowingInput
								placeholder="Mobile (unique)"
								value={profileForm.mobile}
								onChange={(e) =>
									setProfileForm((f) => ({ ...f, mobile: e.target.value }))
								}
								required
								className="focus:ring-pink-400 shadow-pink-200"
								type="tel"
							/>
							<GlowingInput
								placeholder="Gender"
								value={profileForm.gender}
								onChange={(e) =>
									setProfileForm((f) => ({ ...f, gender: e.target.value }))
								}
								required
								className="focus:ring-pink-400 shadow-pink-200"
							/>
							<GlowingInput
								placeholder="Address"
								value={profileForm.address}
								onChange={(e) =>
									setProfileForm((f) => ({ ...f, address: e.target.value }))
								}
								required
								className="focus:ring-pink-400 shadow-pink-200"
							/>
							<GlowingButton
								type="submit"
								disabled={profileLoading}
								className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse"
							>
								{profileLoading ? "Saving..." : "Save Profile"}
							</GlowingButton>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
