/**
 * Editable invitation content. The 12-hour designation, venue names,
 * and detailed addresses are intentionally not fabricated.
 * Documentation files are managed separately on the owner's request.
 */
export const invitation = {
  couple: {
    groom: "Arif Rahman",
    bride: "Suchana Sarker",
    shortGroom: "Arif",
    shortBride: "Suchana",
    initials: "A & S",
  },
  ceremony: {
    title: "Kabin Ceremony",
    time: "12:30",
    date: "Friday, 6 November 2026",
    dateBangla: "শুক্রবার, ৬ নভেম্বর ২০২৬",
    hijri: "26 Jumada al-Awwal 1448 AH",
    hijriArabic: "٢٦ جمادى الأولى ١٤٤٨ هـ",
    hijriNote: "হিজরি তারিখ স্থানীয় চাঁদ দেখার ওপর নির্ভরশীল।",
    timePeriod: null as "AM" | "PM" | null,
  },
  locations: [
    {
      id: "bride-home",
      label: "Bride's Home",
      bangla: "কনের বাড়ি",
      note: "পরিবারের ঠিকানায় পৌঁছানোর পথ দেখুন",
      mapUrl: "https://maps.app.goo.gl/jzKwdBuVfN3soSK96",
      icon: "home" as const,
    },
    {
      id: "mosque",
      label: "Mosque",
      bangla: "মসজিদ",
      note: "মসজিদে যাওয়ার পথ দেখুন",
      mapUrl: "https://maps.app.goo.gl/WRsUky1S7UDiYEf36",
      icon: "mosque" as const,
    },
  ],
  verses: [
    {
      id: "ar-rum",
      eyebrow: "THE BEAUTY OF TOGETHERNESS",
      title: "ভালোবাসা ও প্রশান্তি",
      reference: "সূরা আর-রূম · ৩০:২১",
      arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ",
      bangla: "আল্লাহর নিদর্শনগুলোর একটি হলো, তিনি তোমাদের মধ্য থেকেই জীবনসঙ্গী সৃষ্টি করেছেন, যাতে তোমরা তাদের কাছে প্রশান্তি পাও। তিনি তোমাদের মাঝে ভালোবাসা ও দয়া রেখেছেন। চিন্তাশীল মানুষের জন্য এতে রয়েছে নিদর্শন।",
      link: "https://quran.com/bn/ar-rum/21",
    },
    {
      id: "an-nisa",
      eyebrow: "TWO HEARTS, ONE BEGINNING",
      title: "সম্পর্ক ও দায়িত্ব",
      reference: "সূরা আন-নিসা · ৪:১",
      arabic: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِنْ نَفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَاءً ۚ وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ ۚ إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا",
      bangla: "হে মানুষ, তোমাদের প্রতিপালকের প্রতি সচেতন থাকো। তিনি তোমাদের সৃষ্টি করেছেন একই প্রাণ থেকে, সেখান থেকেই তার সঙ্গীকে সৃষ্টি করেছেন এবং তাঁদের দুজন থেকে বহু নর-নারী ছড়িয়ে দিয়েছেন। পারস্পরিক অধিকার ও আত্মীয়তার সম্পর্কের ব্যাপারে আল্লাহকে স্মরণ রেখো।",
      link: "https://quran.com/bn/an-nisa/1",
    },
    {
      id: "al-furqan",
      eyebrow: "A PRAYER FOR A BEAUTIFUL LIFE",
      title: "সুন্দর জীবনের দোয়া",
      reference: "সূরা আল-ফুরকান · ২৫:৭৪",
      arabic: "وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      bangla: "হে আমাদের রব, আমাদের জীবনসঙ্গী ও সন্তানদের এমন করে দিন যেন তারা আমাদের চোখের প্রশান্তি হয়। আর আমাদের সৎ ও আল্লাহভীরু মানুষের জন্য উত্তম আদর্শ বানিয়ে দিন।",
      link: "https://quran.com/bn/al-furqan/74",
    },
  ],
} as const;

export const pageNames = [
  "Welcome",
  "The Verse",
  "Invitation",
  "The Promise",
  "Locations",
  "The Prayer",
  "Blessings",
] as const;
