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

} as const;

export const pageNames = [
  "Our Beginning",
  "The Invitation",
  "Join Our Celebration",
  "Love & Blessings",
] as const;
