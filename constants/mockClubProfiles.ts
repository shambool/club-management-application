import type { ClubProfile } from "../types/clubProfile";

export const mockClubProfiles: ClubProfile[] = [
  {
    clubId: "ai",
    clubName: "AI & Robotics Club",
    clubLogo: "https://placehold.co/100x100?text=AI",
    description:
      "Exploring artificial intelligence, machine learning, and robotics through hands-on workshops and competitions.",
    currentScore: 145,
    semesterScore: 480,
    presidentId: "user_ai",
    eventIds: ["evt001", "evt002", "evt003"],
  },
  {
    clubId: "art",
    clubName: "Creative Arts Society",
    clubLogo: "https://placehold.co/100x100?text=Art",
    description:
      "A collective of artists and designers hosting painting sessions, exhibitions, and creative workshops.",
    currentScore: 120,
    semesterScore: 410,
    presidentId: "user_art",
    eventIds: ["evt004", "evt005", "evt006"],
  },
  {
    clubId: "sports",
    clubName: "Sports & Fitness Club",
    clubLogo: "https://placehold.co/100x100?text=Sports",
    description:
      "Encouraging active lifestyles with weekly games, fitness challenges, and inter-club tournaments.",
    currentScore: 130,
    semesterScore: 460,
    presidentId: "user_sports",
    eventIds: ["evt007", "evt008", "evt009"],
  },
  {
    clubId: "culture",
    clubName: "Cultural Exchange Club",
    clubLogo: "https://placehold.co/100x100?text=Culture",
    description:
      "Promoting global unity through food festivals, language exchanges, and international events.",
    currentScore: 118,
    semesterScore: 390,
    presidentId: "user_culture",
    eventIds: ["evt010", "evt011", "evt012"],
  },
  {
    clubId: "eco",
    clubName: "Eco & Sustainability Club",
    clubLogo: "https://placehold.co/100x100?text=Eco",
    description:
      "Raising environmental awareness and organizing clean-up drives, tree planting, and sustainability fairs.",
    currentScore: 160,
    semesterScore: 520,
    presidentId: "user_eco",
    eventIds: ["evt013", "evt014", "evt015"],
  },
];
