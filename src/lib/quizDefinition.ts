export const quizDefinition = {
  id: "gita-meditation-2025",
  title: "Ram Navami Meditation Quiz",
  sections: [
    /* ---------------------------------------------------------------------- */
    /* SECTION 1 — Why Bhagavad Gita Matters */
    /* ---------------------------------------------------------------------- */
    {
      id: "s1",
      title: "Short answer",
      description:
        "<p>The Lord's teachings give timeless wisdom spoken by the Lord Himself. (See the Lord's teachings 4.38 purport by Srila Prabhupada for the power of transcendental knowledge.)</p>",
      items: [
        // 1
        {
          id: "s1q1",
          type: "one-word",
          graded: false,
          question: "Who is the author of Ramayana?",
        },
        // 2
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
            "<p>Krishna states in BG 10.10 — '<em>I give the intelligence by which they can come to Me</em>'. Read Srila Prabhupada’s  Bhagavad Gita as it is</p>",
        },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* SECTION 2 — Applying Gita in Life */
    /* ---------------------------------------------------------------------- */
    {
      id: "s2",
      title: "Picture based",
      description:
        "<p>These questions help reflect on practical application. (See BG 2.47 purport for Karma-yoga principles.)</p>",
      items: [
        // 1
        {
          id: "s2q1",
          type: "one-word",
          graded: false,
          image: "/images/rn1.png",
          question: "Identify the character and scene",
          shloka: {
  ref: "Bhagavad Gita 2.47",
  iast:
    "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi ||",
  translation:
    "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."
}

        },
        {
          id: "s2q2",
          type: "one-word",
          graded: false,
          image: "/images/rn2.png",
          question: "Identify the character and share the lesson from this.",
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

    /* ---------------------------------------------------------------------- */
    /* SECTION 3 — Deep Reflection & Meditation */
    /* ---------------------------------------------------------------------- */
    {
      id: "s3",
      title: "Food for thought",
      description:
        "<p>Reflect on your spiritual practice. (See BG 12.20 for qualities dear to Krishna.)</p>",
      items: [
        // 1
        {
          id: "s1q1",
          type: "one-word",
          graded: false,
          image: "/images/rn5.png",
          question: "Who is at fault? ",
        },
        
        // 2
        {
          id: "s3q2",
          type: "one-word",
          graded: false,
          image: "/images/rn6.png",
          question: "Identify the characters & Share your insights from this",
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
        {
          id: "s3q3",
          type: "one-word",
          graded: false,
          image: "/images/rn7.png",
          question: "Who is prioratizing what? How do you think for your life?",
        },
      ],
    },
    {
      id: "s4",
      title: "Application Question",
      description:
        "<p>These questions help reflect on practical application. (See BG 2.47 purport for Karma-yoga principles.)</p>",
      items: [
        // 1
        {
          id: "s4q1",
          type: "one-word",
          graded: false,
          question: "Ayodhya there was a conflict between brothers in Ayodhya. Kishkindha there was a conflict between the brothers. Lanka there was a conflict between brothers. What do you understand from the way of their responses to those internal conflicts amongst them? How can we apply for our lives?",
          

        },
        
      ],
    },
  ],
};