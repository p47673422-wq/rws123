export const quizDefinition = {
  id: "ram-navami-meditation-2025",
  title: "Ram Navami Meditation Quiz",
  sections: [
    {
      id: "s1",
      title: "Meditating on Lord Ram",
      description:
        "<p>Lord Ram, the Supreme Personality of Godhead, appears to establish dharma and teach by His personal example. (Śrīmad Rāmāyaṇa as understood in disciplic succession)</p>",
      items: [
        {
          id: "s1q1",
          type: "one-word",
          graded: false,
          question: "Who is the author of Ramayana?",
        },
        {
          id: "s1q2",
          type: "one-word",
          graded: false,
          question: "Who is the Guru of Lord Rama?",
        },
        {
          id: "s1p1",
          type: "paragraph",
          graded: false,
          html:
            "<p>Lord Ram perfectly followed dharma even at great personal cost, showing that a devotee must always uphold the order of the Supreme Lord.</p>",
        },
      ],
    },

    {
      id: "s2",
      title: "Learning Dharma & Devotion from Lord Ram",
      description:
        "<p>These questions help reflect on practical application of Lord Ram’s teachings.</p>",
      items: [
        {
          id: "s2q1",
          type: "one-word",
          graded: false,
          image: "/images/rn1.png",
          question: "Identify the character and scene",
          shloka: {
            ref: "Valmiki Ramayana, Ayodhya Kanda 109.11",
            iast:
              "rāmo vigrahavān dharmaḥ sādhur satya-parākramaḥ | rāmo daśarathir śrīmān dharmajño dharma-vatsalaḥ ||",
            translation:
              "Lord Rama is the very embodiment of dharma, truthful, powerful, and always devoted to righteousness."
          }
        },
        {
          id: "s2q2",
          type: "one-word",
          graded: false,
          image: "/images/rn2.png",
          question: "Identify the character and share the lesson from this.",
        },
        {
          id: "s2p1",
          type: "paragraph",
          graded: false,
          html:
            "<p>Śabarī offered fruits with pure devotion, and Lord Ram accepted them, showing that bhakti is the essence of all offerings.</p>",
          shloka: {
            ref: "Valmiki Ramayana, Aranya Kanda (Śabarī episode)",
            iast:
              "bhaktyā paramayā yuktaḥ",
            translation:
              "The Lord is pleased by one who is endowed with supreme devotion."
          },
        },
        {
          id: "s2q3",
          type: "one-word",
          graded: false,
          image: "/images/rn3.png",
          question: "Is he successful or failure - explain;",
        },
        {
          id: "s2q4",
          type: "one-word",
          graded: false,
          image: "/images/rn4.png",
          question: "Explain the lesson from this ",
        },
      ],
    },

    {
      id: "s3",
      title: "Food for thought",
      description:
        "<p>Reflect on devotional service as shown by Hanuman, the ideal servant of Lord Ram.</p>",
      items: [
        {
          id: "s3q1",
          type: "one-word",
          graded: false,
          image: "/images/rn5.png",
          question: "Who is at fault? ",
        },
        {
          id: "s3q2",
          type: "one-word",
          graded: false,
          image: "/images/rn6.png",
          question: "Identify the characters & Share your insights from this",
        },
        {
          id: "s3p1",
          type: "paragraph",
          graded: false,
          html:
            "<p>Hanuman exemplifies pure devotional service (dāsya-bhāva), always acting only for the pleasure of Lord Ram.</p>",
          shloka: {
            ref: "Valmiki Ramayana, Yuddha Kanda",
            iast:
              "dāso'ham kosalendrasya rāmasyākliṣṭa-karmaṇaḥ |",
            translation:
              "I am the servant of Lord Rama, the king of Kosala, who performs flawless actions."
          }
        },
        {
          id: "s3q3",
          type: "one-word",
          graded: false,
          image: "/images/rn7.png",
          question: "Who is prioritizing what? How do you think for your life?",
        },
      ],
    },

    {
      id: "s4",
      title: "Application Question",
      description:
        "<p>Analyze conflicts in Ramayana through the lens of dharma and devotion.</p>",
      items: [
        {
          id: "s4q1",
          type: "one-word",
          graded: false,
          question: "Ayodhya (Rama–Bharata), Kishkindha (Sugriva–Vali), Lanka (Ravana–Vibhishana): How did each respond to conflict? What does this teach about dharma and devotion?",
        },
      ],
    },
    {
          id: "s4q2",
          type: "single-choice",
          graded: false,
          question: "Would you like to opt for free course on bhakti wisdom?",
          options: ["Yes - Offlie mode", "AYes - Online mode", "No"],
          answerIndex: 0,
        },
  ],
};
