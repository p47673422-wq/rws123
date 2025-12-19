export const fourConceptQuizDefinition = {
  id: "four-fundamental-truths",
  title: "Four Fundamental Truths of the Gita",
  type: "concept-journey",
  submitMode: "per-section",

  sections: [
    /* ====================================================================== */
    /* CONCEPT 1 */
    /* ====================================================================== */
    {
      id: "c1",
      submitAs: "four-fundamental-truths:c1",
      title: "This Body is NOT All-in-All",
      subtitle: "The Soul Exists (BG 2.13)",
      video: { url: "/v1.mp4" },

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
          html: `
<div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
  <p class="italic text-slate-600 text-sm leading-relaxed">
    dehino ’smin yathā dehe kaumāraṁ yauvanaṁ jarā<br/>
    tathā dehāntara-prāptir dhīras tatra na muhyati
  </p>

  <hr class="my-4 border-amber-200"/>

  <p class="text-slate-700 text-sm leading-relaxed">
    As the embodied soul passes from childhood to youth to old age,
    the soul similarly passes into another body at death.
    A sober person is not bewildered by such a change.
  </p>
</div>
          `,
        },
      ],
    },

    /* ====================================================================== */
    /* CONCEPT 2 */
    /* ====================================================================== */
    {
      id: "c2",
      submitAs: "four-fundamental-truths:c2",
      title: "This Life is NOT All-in-All",
      subtitle: "The Next Life Exists (BG 2.22)",
      video: { url: "/v2.mp4" },

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
          html: `
<div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
  <p class="italic text-slate-600 text-sm leading-relaxed">
    vāsāṁsi jīrṇāni yathā vihāya navāni gṛhṇāti naro ’parāṇi<br/>
    tathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī
  </p>

  <hr class="my-4 border-amber-200"/>

  <p class="text-slate-700 text-sm leading-relaxed">
    As a person puts on new garments, giving up old ones,
    the soul similarly accepts new material bodies,
    giving up the old and useless ones.
  </p>
</div>
          `,
        },
      ],
    },

    /* ====================================================================== */
    /* CONCEPT 3 — GRADED VISUAL MATCH (6 ITEMS) */
    /* ====================================================================== */
    {
      id: "c3",
      submitAs: "four-fundamental-truths:c3",
      title: "We are NOT All-in-All",
      subtitle: "The Supreme Lord Exists (BG 7.7)",
      video: { url: "/v3.mp4" },

      items: [
        { id: "c3_q1", type: "one-word", graded: false, question: "Share your comment about the video of common sense.", }, 
        { id: "c3_q2", type: "one-word", graded: false, question: "According to BG 7.7, what is the thread compared to and what are the pearls compared to?", shloka: { ref: "Bhagavad Gita 7.7", iast: "mattaḥ parataraṁ nānyat kiñcid asti dhanañ-jaya | mayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva ||", translation: "O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread." },},
        {
          id: "c3_match",
          type: "match",
          ui: "visual-dnd",
          graded: true,
          question:
            "Match column A (country government) with column B (universal government):",

          columnA: [
            { label: "Home Ministry \n(Law and order)\n", image: "/images/w1.png" },
            { label: "Health Ministry", image: "/images/w2.jpg" },
            { label: "Ministry of Energy \n(Electricity and Lighting)", image: "/images/w3.png" },
            { label: "Finance Ministry\n(Currency or wealth)\n", image: "/images/w4.png" },
            { label: "Defense Ministry\n(Protection from dangers)", image: "/images/w5.png" },
            { label: "Education Ministry\n(Education for citizens)\n", image: "/images/w6.png" },
          ],

          columnB: [
            { label: "Sun and Moon", image: "/images/q1.jpg" },
            { label: "Ozonosphere, \nImmunity in body,\n", image: "/images/r2.png" },
            { label: "Ayurvedic herbs", image: "/images/r3.png" },
            { label: "Vedas, Bible, Quran", image: "/images/r4.png" },
            { label: "Illicit sex 🡪 AIDS\nSmoking 🡪 Cancer \nDrinking 🡪 Liver problem", image: "/images/r5.png" },
            { label: "Gold, silver, nava ratnas, diamonds", image: "/images/r6.png" },
          ],

          correctMap: {
            "0": 4,
            "1": 2,
            "2": 0,
            "3": 5,
            "4": 1,
            "5": 3,
          },
        },

        {
          id: "c3_reflect",
          type: "paragraph",
          graded: false,
          html: `
<div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
  <p class="italic text-slate-600 text-sm leading-relaxed">
    mattaḥ parataraṁ nānyat kiñcid asti dhanañ-jaya<br/>
    mayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva
  </p>

  <hr class="my-4 border-amber-200"/>

  <p class="text-slate-700 text-sm leading-relaxed">
    There is no truth superior to the Supreme Lord.
    Everything rests upon Him,
    as pearls are strung on a thread.
  </p>
</div>
          `,
        },
      ],
    },

    /* ====================================================================== */
    /* CONCEPT 4 */
    /* ====================================================================== */
    {
      id: "c4",
      submitAs: "four-fundamental-truths:c4",
      title: "This World is NOT All-in-All",
      subtitle: "The Spiritual World Exists (BG 8.15–16, 8.21)",
      // video: { url: "/v4.mp4" },
      images: [
    "/images/i1.png",
    "/images/i2.png",
    "/images/i3.png",
    "/images/i4.png",
    "/images/i5.png",
    "/images/i6.png",
    "/images/i7.png",
    "/images/i8.png",
  ],

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
          html: `
<div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4">
  <p class="italic text-slate-600 text-sm">
    mām upetya punar janma duḥkhālayam aśāśvatam<br/>
    nāpnuvanti mahātmānaḥ saṁsiddhiṁ paramāṁ gatāḥ
  </p>

  <p class="italic text-slate-600 text-sm">
    ā-brahma-bhuvanāl lokāḥ punar āvartino ’rjuna<br/>
    mām upetya tu kaunteya punar janma na vidyate
  </p>

  <p class="italic text-slate-600 text-sm">
    avyakto ’kṣara ity uktas tam āhuḥ paramāṁ gatim<br/>
    yaṁ prāpya na nivartante tad dhāma paramaṁ mama
  </p>

  <hr class="border-amber-200"/>

  <p class="text-slate-700 text-sm leading-relaxed">
    The spiritual world is eternal and free from suffering.
    One who attains the Supreme abode never returns to this temporary world.
  </p>
</div>
          `,
        },
      ],
    },
  ],
};
