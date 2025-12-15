export const quizDefinition = {
  id: "gita-meditation-2025",
  title: "Gita Meditation Quiz",
  sections: [
    /* ---------------------------------------------------------------------- */
    /* SECTION 1 — Why Bhagavad Gita Matters */
    /* ---------------------------------------------------------------------- */
    {
      id: "s1",
      title: "Why Bhagavad Gita Matters",
      description:
        "<p>The Bhagavad Gita gives timeless wisdom spoken by Lord Krishna Himself. (See BG 4.38 purport by Srila Prabhupada for the power of transcendental knowledge.)</p>",
      items: [
        // 1
        {
          id: "s1q1",
          type: "single-choice",
          graded: true,
          question: "Who spoke the Bhagavad Gita?",
          options: ["Lord Krishna", "Arjuna", "Vyasa", "Sanjaya"],
          answerIndex: 0,
        },
        // 2
        {
          id: "s1q2",
          type: "multi-choice",
          graded: true,
          question: "According to Gita, which qualities develop by spiritual knowledge?",
          options: ["Peacefulness", "Arrogance", "Purity of heart", "Detachment"],
          answerIndexes: [0, 2, 3],
        },
        // 3
        {
          id: "s1q3",
          type: "true-false",
          graded: true,
          question: "BG 4.38 says: 'There is no purifier equal to transcendental knowledge.'",
          options: ["True", "False"],
          answerIndex: 0,
          shloka: {
  ref: "Bhagavad Gita 4.38",
  iast:
    "na hi jñānena sadṛśaṁ pavitram iha vidyate | tat svayaṁ yoga-saṁsiddhaḥ kālenātmani vindati ||",
  translation:
    "In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism. One who has achieved this knowledge enjoys it within himself in due course of time."
}

        },
        // 4
        {
          id: "s1p1",
          type: "paragraph",
          graded: false,
          html:
            "<p>Krishna states in BG 10.10 — '<em>I give the intelligence by which they can come to Me</em>'. Read Srila Prabhupada’s  Bhagavad Gita as it is</p>",
        },
        // 5 (One-word)
        {
          id: "s1q4",
          type: "one-word",
          graded: false,
          question: "In one word, what does Krishna ask for in BG 18.66? (Hint: S____)",
          shloka: {
  ref: "Bhagavad Gita 18.66",
  iast:
    "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja | ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||",
  translation:
    "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear."
}

        },
        // 6 (Image-based)
        {
          id: "s1q5",
          type: "single-choice",
          graded: true,
          question: "Which scene is depicted in this image?",
          image: "/images/arjuna-krishna-chariot.jpg",
          options: [
            "Krishna speaking Bhagavad Gita",
            "Krishna lifting Govardhan",
            "Krishna dancing with gopis",
            "Ram battling Ravana",
          ],
          answerIndex: 0,
        },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* SECTION 2 — Applying Gita in Life */
    /* ---------------------------------------------------------------------- */
    {
      id: "s2",
      title: "Applying Gita in Daily Life",
      description:
        "<p>These questions help reflect on practical application. (See BG 2.47 purport for Karma-yoga principles.)</p>",
      items: [
        // 1
        {
          id: "s2q1",
          type: "multi-choice",
          graded: true,
          question: "Which attitudes does Gita encourage?",
          options: [
            "Act without attachment",
            "Expect rewards always",
            "Serve selflessly",
            "Offer results to Krishna",
          ],
          answerIndexes: [0, 2, 3],
          shloka: {
  ref: "Bhagavad Gita 2.47",
  iast:
    "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi ||",
  translation:
    "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."
}

        },
        // 2
        {
          id: "s2q2",
          type: "single-choice",
          graded: true,
          question: "BG 2.47 instructs us to:",
          options: [
            "Renounce all action",
            "Act without attachment to results",
            "Focus only on results",
            "Avoid duties",
          ],
          answerIndex: 1,
        },
        // 3
        {
          id: "s2q3",
          type: "true-false",
          graded: true,
          question: "Krishna says in BG 9.22 that He personally preserves what devotees lack.",
          options: ["True", "False"],
          answerIndex: 0,
          shloka: {
  ref: "Bhagavad Gita 9.22",
  iast:
    "ananyāś cintayanto māṁ ye janāḥ paryupāsate | teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham ||",
  translation:
    "But those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and I preserve what they have."
}

        },
        // 4 (Fill Blank)
        {
          id: "s2q4",
          type: "fill-blank",
          graded: false,
          question:
            "Fill the blank (BG 2.47): 'You have a right to perform your prescribed duties, but you are not entitled to the ______.'",
        },
        // 5 (Paragraph)
        {
          id: "s2p1",
          type: "paragraph",
          graded: false,
          html:
            "<p>In BG 9.26 Krishna says: '<em>Offer Me a leaf, a flower, fruit and water</em>'. Srila Prabhupada explains devotion matters more than the item offered.</p>",
          shloka: {
  ref: "Bhagavad Gita 9.26",
  iast:
    "patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati | tad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ ||",
  translation:
    "If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it."
}

        },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* SECTION 3 — Deep Reflection & Meditation */
    /* ---------------------------------------------------------------------- */
    {
      id: "s3",
      title: "Deep Reflection & Meditation",
      description:
        "<p>Reflect on your spiritual practice. (See BG 12.20 for qualities dear to Krishna.)</p>",
      items: [
        // 1
        {
          id: "s3q1",
          type: "match",
          graded: true,
          question: "Match each term with its meaning",
          columnA: ["Bhakti", "Kshama", "Svadhyaya", "Saranagati"],
          columnB: [
            "Forgiveness",
            "Devotional service",
            "Study of scripture",
            "Surrender to Krishna",
          ],
          correctMap: { 0: 1, 1: 0, 2: 2, 3: 3 },
        },
        // 2
        {
          id: "s3q2",
          type: "single-choice",
          graded: true,
          question: "Which quality is highlighted in BG 12.13–14?",
          options: ["Hatred", "Compassion", "Anger", "False ego"],
          answerIndex: 1,
          shloka: {
  ref: "Bhagavad Gita 12.13–14",
  iast:
    "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca | nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī ||\n" +
    "santuṣṭaḥ satataṁ yogī yatātmā dṛḍha-niścayaḥ | mayy arpita-mano-buddhir yo mad-bhaktaḥ sa me priyaḥ ||",
  translation:
    "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant, always satisfied, self-controlled, and engaged in devotional service with determination—such a devotee of Mine is very dear to Me."
}

        },
        // 3
        {
          id: "s3q3",
          type: "true-false",
          graded: true,
          question:
            "BG 6.5 teaches that the mind can be both a friend and an enemy.",
          options: ["True", "False"],
          answerIndex: 0,
          shloka: {
  ref: "Bhagavad Gita 6.5",
  iast:
    "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||",
  translation:
    "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well."
}

        },
        // 4
        {
          id: "s3q4",
          type: "one-word",
          graded: false,
          question:
            "One word: What does Krishna want us to remember constantly? (Hint: His name)",
        },
        // 5
        {
          id: "s3p1",
          type: "paragraph",
          graded: false,
          html:
            "<p>BG 12.20 summarizes: devotees engaged with faith are very dear to Krishna. See Srila Prabhupada’s purport for full meaning.</p>",
        shloka: {
  ref: "Bhagavad Gita 12.20",
  iast:
    "ye tu dharmyāmṛtam idaṁ yathoktaṁ paryupāsate | śraddadhānā mat-paramā bhaktās te 'tīva me priyāḥ ||",
  translation:
    "Those who follow this imperishable path of devotional service and who completely engage themselves with faith, making Me the supreme goal, are very, very dear to Me."
}

        },
      ],
    },
  ],
};