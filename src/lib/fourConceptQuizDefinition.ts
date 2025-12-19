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
        {
          id: "c1_reflect",
          type: "paragraph",
          graded: false,
          html:
            "<p className='mt-3 text-sm text-center italic text-slate-600'>dehino ’smin yathā dehe kaumāraṁ yauvanaṁ jarā | <br/>tathā dehāntara-prāptir dhīras tatra na muhyati || </p><p className='mt-4 text-sm text-slate-700 leading-relaxed text-center'>  As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.</p>",
              },
      ],
    },

    {
      id: "c2",
      submitAs: "four-fundamental-truths:c2",
      title: "This Life is NOT All-in-All",
      subtitle: "Next Life Exists (BG 2.22)",
      video: {
        url: "/v2.mp4",
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
        {
          id: "c2_reflect",
          type: "paragraph",
          graded: false,
          html:
            "<p className='mt-3 text-sm text-center italic text-slate-600'>vāsāṁsi jīrṇāni yathā vihāya navāni gṛhṇāti naro ’parāṇi | <br/>tathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī || </p><p className='mt-4 text-sm text-slate-700 leading-relaxed text-center'>  As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.</p>",
              },
      ],
    },

    {
      id: "c3",
      submitAs: "four-fundamental-truths:c3",
      title: "We are NOT All-in-All",
      subtitle: "The Supreme Lord Exists (BG 7.7)",
      video: {
        url: "/v3.mp4",
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
        {
          id: "c3_reflect",
          type: "paragraph",
          graded: false,
          html:
            "<p className='mt-3 text-sm text-center italic text-slate-600'>mattaḥ parataraṁ nānyat kiñcid asti dhanañjaya | <br/>mayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva || </p><p className='mt-4 text-sm text-slate-700 leading-relaxed text-center'> O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.</p>",
              },
      ],
    },

    {
      id: "c4",
      submitAs: "four-fundamental-truths:c4",
      title: "This World is NOT All-in-All",
      subtitle: "The Spiritual World Exists (BG 8.15–16, 8.21)",
      video: {
        url: "/v4.mp4",
      },
      items: [
        {
          id: "c4_q1",
          type: "one-word",
          graded: false,
          question:
            "Who is compared to the father and who is compared to the child?",
        },
        {
          id: "c4_reflect",
          type: "paragraph",
          graded: false,
          html:
            "<p className='mt-3 text-sm text-center italic text-slate-600'>mām upetya punar janma duḥkhālayam aśāśvatam | <br/>nāpnuvanti mahātmānaḥ saṁsiddhiṁ paramāṁ gatāḥ || </p><p className='mt-4 text-sm text-slate-700 leading-relaxed text-center'> After attaining Me, the great souls, who are yogīs in devotion, never return to this temporary world, which is full of miseries, because they have attained the highest perfection.</p><p className='mt-3 text-sm text-center italic text-slate-600'>ā-brahma-bhuvanāl lokāḥ punar āvartino ’rjuna | <br/>mām upetya tu kaunteya punar janma na vidyate || </p><p className='mt-4 text-sm text-slate-700 leading-relaxed text-center'> From the highest planet in the material world down to the lowest, all are places of misery wherein repeated birth and death take place. But one who attains to My abode, O son of Kuntī, never takes birth again.</p><p className='mt-3 text-sm text-center italic text-slate-600'>avyakto ’kṣara ity uktas tam āhuḥ paramāṁ gatim | <br/>yaṁ prāpya na nivartante tad dhāma paramaṁ mama || </p><p className='mt-4 text-sm text-slate-700 leading-relaxed text-center'> That which the Vedāntists describe as unmanifest and infallible, that which is known as the supreme destination, that place from which, having attained it, one never returns — that is My supreme abode.</p>",
              },
      ],
    },
  ],
};
