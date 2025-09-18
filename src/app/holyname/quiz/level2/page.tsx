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
		img: "/images/story1.png",
		text: "After the war, when Lord Rama and Mother Sita were joyfully reunited, everyone praised Hanuman for his unmatched devotion and bravery. To express her gratitude, Mother Sita gave Hanuman a beautiful necklace of shining pearls. Hanuman accepted it, but soon he began breaking each pearl and carefully looking inside. The people in the court were surprised and asked why he was destroying such a precious gift. Hanuman humbly replied, 'I am searching for Rama and Sita inside these pearls. If they are not there, what use are they to me?' Some doubted him and said, 'Do you mean to say Rama and Sita live inside you?' To prove his devotion, Hanuman tore open his chest, and everyone was stunned to see Lord Rama and Mother Sita dwelling in his heart.",
		question: "What is real wealth?",
	},
	{
		img: "/images/ans_ram.png",
		text: "Vibhishana came to Lord Rama by flying across the ocean along with his demon associates. After reaching the other side, he instructed his associates to leave without him. However, since none of them could fly, they asked Vibhishana for help. Vibhishana then handed each of them a small paper and said, 'If you hold this paper while going into the water, you will not drown.' To their surprise, even in the middle of the sea, they were floating safely. Curious, the demons opened the chits to see what was written on them. To their shock and anger, they found only the name of Lord Rama. Disgusted, they immediately threw the papers away—and the moment they did so, they began to drown. One by one, all the demons perished in the ocean.",
		question: "What is the one thing we should never leave in our lives and why? (Answer in one sentence)",
	},
	{
		img: "/images/story3.png",
		text: "Haridasa Thakura, born in a Muslim family, is called as the Nāmacarya (teacher of the holy name) and a close associate of Sri Chaitanya Mahaprabhu (Krishna himself). Once, an envious man sent a prostitute to seduce him, but Haridasa calmly continued his vow of chanting 300,000 names of Krishna daily. Over three nights, as she listened to his chanting, her heart changed—she confessed her plan, gave up her sinful life, and became a devoted follower, showing the power of Haridasa’s purity and the holy name.",
		question: "What made the prostitute transform herself?",
	},
	{
		img: "/images/story4.png",
		text: "Srila A.C. Bhaktivedanta Swami Prabhupada was a great spiritual teacher who brought the teachings of Lord Krishna to the Western world. In 1965, at the age of 69, he traveled alone from India to America with just a few books and little money, to preach about Krishna. In the 1960s, many young people in America, called hippies, were frustrated with materialism and searching for peace and happiness. They tried drugs, music, and rebellion, but remained unsatisfied. When they met Srila Prabhupada in New York, he introduced them to the chanting of the Hare Krishna and the path of bhakti. The hippies found real joy, peace, and purpose in chanting, dancing, and serving Krishna. They gave up bad habits and became known as the 'happies.' With Prabhupada’s guidance, they spread Krishna consciousness all over the world.",
		question: "How did Srila Prabhupada transform the hippies of America into 'happies'?",
	},
];

const researchLinks = [
	{
		label: "Modern Science & Mantra Meditation (PDF)",
		url: "https://drive.google.com/file/d/1nlk00FwCxf_TDJb3A-hF17e1xnGvs7Wu/view?usp=sharing",
	},
	{
		label: "Neuroscience of Devotion (PDF)",
		url: "https://drive.google.com/file/d/1bFvZx8lzuGlGLGvXKiydyULhZiCRUYgG/view?usp=sharing",
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
		} else {
			setAnswers(level2Answers.map((a: any) => a.answer));
			if (giftObj && giftObj.unlocked) {
				setStatus("unlocked");
				setGift(giftObj);
			} else {
				setStatus("locked");
			}
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
			const mobile = typeof window !== "undefined" ? localStorage.getItem("mkt_mobile") : "";
			if (mobile) {
				const res = await fetch(`/api/holyname/profile?mobile=${encodeURIComponent(mobile)}`);
				if (res.ok) {
					const data = await res.json();
					userProfile = data.user;
				}
			}
		}
		if (!userProfile) {
			setShowProfileModal(true);
			return;
		}
			// Prepare answers: mark empty answers as null
			const answersWithNulls = answers.map(a => a === "" ? null : a);
			// Validate
		let nextStatus: "locked" | "unlocked" | "new" | "incomplete" = "locked";
			let nextGift = null;
			let nextMessage = "Saved, but gift is locked.";
			if (answersWithNulls.some((a) => a === null)) {
				nextStatus = "locked";
				nextMessage = "Please answer all stories to unlock your laddoo gift.";
				await fetch("/api/holyname/quiz/submit", {
					method: "POST",
					body: JSON.stringify({
						userId: userProfile.id,
						level: 2,
						answers: answersWithNulls,
						isComplete: false,
					}),
					headers: { "Content-Type": "application/json" },
				});
			} else {
				const res = await fetch("/api/holyname/quiz/submit", {
					method: "POST",
					body: JSON.stringify({
						userId: userProfile.id,
						level: 2,
						answers: answersWithNulls,
						isComplete: true,
					}),
					headers: { "Content-Type": "application/json" },
				});
				const data = await res.json();
				if (data.gift?.unlocked) {
					nextStatus = "unlocked";
					nextGift = data.gift;
					nextMessage = "Congratulations! You unlocked your laddoo gift.";
				}
			}
			setGift(nextGift);
			setStatus(nextStatus);
			setMessage(nextMessage);
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

	// Modern Research Step
	if (step === 4) {
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
				<h2 className="text-2xl font-bold text-orange-700 mb-4">Modern Research</h2>
				<div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mb-6">
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
				<GlowingButton onClick={handleSubmit}>Submit Quiz & Claim Gift</GlowingButton>
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
									localStorage.setItem("mkt_mobile", profileForm.mobile);
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

		// Show summary if quiz is locked or unlocked
		if (status === "locked" || status === "unlocked") {
			return (
				<div className="min-h-screen bg-gradient-to-br from-orange-200 via-white to-yellow-50 flex flex-col items-center py-8 px-2">
					<div className="w-full flex justify-start mb-4">
						<a
							href="/holyname/profile"
							className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition"
						>
							← Back to Profile
						</a>
					</div>
					<h2 className="text-2xl font-bold text-orange-700 mb-4">Level 2 Quiz Summary</h2>
					{gift && gift.unlocked && (
						<GiftCard unlocked name="Laddoo Gift" />
					)}
					<div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full max-w-2xl">
						<h3 className="text-lg font-semibold text-orange-700 mb-2">Your Answers:</h3>
						<ul className="mt-2 text-orange-900">
							{answers.map((a, i) => (
								<li key={i}>
									<span className="font-bold">Question {i + 1}:</span> {a || <span className="italic text-gray-400">(Unanswered)</span>}
								</li>
							))}
						</ul>
					</div>
					<div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full max-w-2xl">
						<h3 className="text-lg font-semibold text-orange-700 mb-2">Modern Research Links:</h3>
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
											localStorage.setItem("mkt_mobile", profileForm.mobile);
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
			// Card Carousel for Stories (default)
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
							className="w-full max-w-2xl flex flex-col items-center"
						>
							{/* FlipCard for each story */}
							<FlipCard
								frontImg={stories[step].img}
								backContent={
									<div className="flex flex-col gap-4 items-center p-4">
										<div className="text-lg font-semibold text-orange-700 mb-2 text-center" style={{ fontFamily: 'serif' }}>
											{stories[step].text}
										</div>
									</div>
								}
								width="100%"
								imgClassName="w-full h-64 object-cover rounded-xl"
								showFlipButton={true}
							/>
							<div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full">
								<div className="font-bold text-orange-700 mb-2 text-lg">{stories[step].question}</div>
								<GlowingInput
									type="text"
									value={answers[step]}
									onChange={(e) => handleInput(step, e.target.value)}
									placeholder="Type your answer here..."
									required={status === "new" || status === "incomplete"}
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
											localStorage.setItem("mkt_mobile", profileForm.mobile);
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
