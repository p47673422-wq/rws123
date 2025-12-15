export const fourConceptQuizDefinition = {
  id: "four-fundamental-truths",
  title: "Four Fundamental Truths of the Gita",
  type: "concept-journey",
  submitMode: "per-section",

  sections: [
    {
      id: "c1",
      submitAs: "four-fundamental-truths:c1",
      title: "This Body is NOT All-in-All",
      subtitle: "The Soul Exists (BG 2.13)",
      video: {
        url: "/v1.mp4",
      },
      items: [
        {
          id: "c1_q1",
          type: "one-word",
          graded: false,
          question:
            "What is changing and what is not changing for the lady shown in the video?",
        },
      ],
    },

    {
      id: "c2",
      submitAs: "four-fundamental-truths:c2",
      title: "This Life is NOT All-in-All",
      subtitle: "Next Life Exists (BG 2.22)",
      video: {
        url: "https://youtube.com/VIDEO_2",
      },
      items: [
        {
          id: "c2_q1",
          type: "multi-choice",
          graded: true,
          question: "Select all statements aligned with the teaching:",
          options: [
            "We are not human beings having a spiritual experience; we are spiritual beings having a human experience",
            "We are human beings having a spiritual experience",
            "We are spiritual beings",
            "We are not this human body, but we have this human body",
          ],
          answerIndexes: [0, 2, 3],
        },
      ],
    },

    {
      id: "c3",
      submitAs: "four-fundamental-truths:c3",
      title: "We are NOT All-in-All",
      subtitle: "The Supreme Lord Exists (BG 7.7)",
      video: {
        url: "https://youtube.com/VIDEO_3",
      },
      items: [
        {
          id: "c3_q1",
          type: "one-word",
          graded: false,
          question:
            "Share your comment about the video of common sense.",
        },
        {
          id: "c3_q2",
          type: "one-word",
          graded: false,
          question:
            "According to BG 7.7, what is the thread compared to and what are the pearls compared to?",
        shloka: {
  ref: "Bhagavad Gita 7.7",
  iast:
    "mattaḥ parataraṁ nānyat kiñcid asti dhanañ-jaya | mayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva ||",
  translation:
    "O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread."
}
        },
      ],
    },

    {
      id: "c4",
      submitAs: "four-fundamental-truths:c4",
      title: "This World is NOT All-in-All",
      subtitle: "The Spiritual World Exists (BG 8.15–16, 8.21)",
      video: {
        url: "https://youtube.com/VIDEO_4",
      },
      items: [
        {
          id: "c4_q1",
          type: "one-word",
          graded: false,
          question:
            "Who is compared to the father and who is compared to the child?",
        },
      ],
    },
  ],
};
