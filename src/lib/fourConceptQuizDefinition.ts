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
        url: "https://youtube.com/VIDEO_1",
      },
      items: [
        {
          id: "c1_q1",
          type: "paragraph",
          graded: false,
          html:
            "<p><b>Reflection:</b> What is changing and what is not changing for the lady shown in the video?</p>",
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
          id: "c3_reflect",
          type: "paragraph",
          graded: false,
          html:
            "<p><b>Reflection:</b> Share your comment about the video of common sense.</p>",
        },
        {
          id: "c3_q1",
          type: "one-word",
          graded: false,
          question:
            "According to BG 7.7, what is the thread compared to and what are the pearls compared to?",
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
          id: "c4_reflect",
          type: "paragraph",
          graded: false,
          html:
            "<p><b>Reflection:</b> Who is compared to the father and who is compared to the child?</p>",
        },
      ],
    },
  ],
};
