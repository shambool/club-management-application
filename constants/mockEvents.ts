import type { Event } from "../types/event";
import { mockClubProfiles } from "./mockClubProfiles";

export const mockEvents: Event[] = [
  // AI CLUB EVENTS
  {
    eventId: "evt001",
    eventTitle: "AI & Robotics Expo",
    eventPoster: "https://placehold.co/400x250?text=AI+Expo",
    storageId: "evt001",
    attending: 87,
    hasVolunteerOption: true,
    description: [
      {
        time: "Oct 20, 2025 - 10:00 AM",
        place: "Tech Hall A",
        desc: "Explore the latest innovations in AI and robotics!",
      },
    ],
    date: "2025-10-20",
    club: mockClubProfiles[0],
  },
  {
    eventId: "evt002",
    eventTitle: "Intro to Neural Networks",
    eventPoster: "https://placehold.co/400x250?text=Neural+Networks",
    storageId: "evt002",
    attending: 55,
    hasVolunteerOption: false,
    description: [
      {
        time: "Nov 10, 2025 - 4:00 PM",
        place: "Room 204",
        desc: "Learn the basics of neural networks and build your first model.",
      },
    ],
    date: "2025-11-10",
    club: mockClubProfiles[0],
  },
  {
    eventId: "evt003",
    eventTitle: "AI Hackathon 2025",
    eventPoster: "https://placehold.co/400x250?text=AI+Hackathon",
    storageId: "evt003",
    attending: 120,
    hasVolunteerOption: true,
    description: [
      {
        time: "Dec 1, 2025 - 8:00 AM",
        place: "Innovation Lab",
        desc: "Compete to build innovative AI solutions within 24 hours.",
      },
    ],
    date: "2025-12-01",
    club: mockClubProfiles[0],
  },

  // ART CLUB EVENTS
  {
    eventId: "evt004",
    eventTitle: "Digital Painting Workshop",
    eventPoster: "https://placehold.co/400x250?text=Painting+Workshop",
    storageId: "evt004",
    attending: 42,
    description: [
      {
        time: "Oct 25, 2025 - 2:00 PM",
        place: "Art Studio 3",
        desc: "A workshop exploring digital tools for creative expression.",
      },
    ],
    date: "2025-10-25",
    club: mockClubProfiles[1],
  },
  {
    eventId: "evt005",
    eventTitle: "Campus Art Exhibition",
    eventPoster: "https://placehold.co/400x250?text=Art+Exhibition",
    storageId: "evt005",
    attending: 95,
    hasVolunteerOption: true,
    description: [
      {
        time: "Nov 8, 2025 - 6:00 PM",
        place: "Main Gallery",
        desc: "Showcasing the best student artworks of the semester.",
      },
    ],
    date: "2025-11-08",
    club: mockClubProfiles[1],
  },
  {
    eventId: "evt006",
    eventTitle: "Creative Design Jam",
    eventPoster: "https://placehold.co/400x250?text=Design+Jam",
    storageId: "evt006",
    attending: 60,
    hasVolunteerOption: false,
    description: [
      {
        time: "Dec 10, 2025 - 1:00 PM",
        place: "Design Studio",
        desc: "A 3-hour creative sprint for designers and artists.",
      },
    ],
    date: "2025-12-10",
    club: mockClubProfiles[1],
  },

  // SPORTS CLUB EVENTS
  {
    eventId: "evt007",
    eventTitle: "Inter-College Football Match",
    eventPoster: "https://placehold.co/400x250?text=Football+Match",
    storageId: "evt007",
    attending: 150,
    hasVolunteerOption: true,
    description: [
      {
        time: "Oct 30, 2025 - 5:00 PM",
        place: "Campus Stadium",
        desc: "Watch our team compete in the annual inter-college football event.",
      },
    ],
    date: "2025-10-30",
    club: mockClubProfiles[2],
  },
  {
    eventId: "evt008",
    eventTitle: "Fitness Challenge Week",
    eventPoster: "https://placehold.co/400x250?text=Fitness+Week",
    storageId: "evt008",
    attending: 75,
    description: [
      {
        time: "Nov 15, 2025 - 9:00 AM",
        place: "Gym Hall",
        desc: "Join our 7-day challenge and track your fitness progress.",
      },
    ],
    date: "2025-11-15",
    club: mockClubProfiles[2],
  },
  {
    eventId: "evt009",
    eventTitle: "Winter Sports Tournament",
    eventPoster: "https://placehold.co/400x250?text=Winter+Games",
    storageId: "evt009",
    attending: 130,
    hasVolunteerOption: true,
    description: [
      {
        time: "Dec 20, 2025 - 10:00 AM",
        place: "Main Ground",
        desc: "Annual winter competition featuring multiple sports.",
      },
    ],
    date: "2025-12-20",
    club: mockClubProfiles[2],
  },

  // CULTURAL CLUB EVENTS
  {
    eventId: "evt010",
    eventTitle: "International Food Festival",
    eventPoster: "https://placehold.co/400x250?text=Food+Festival",
    storageId: "evt010",
    attending: 200,
    description: [
      {
        time: "Oct 22, 2025 - 1:00 PM",
        place: "Campus Lawn",
        desc: "Taste cuisines from around the world in one event.",
      },
    ],
    date: "2025-10-22",
    club: mockClubProfiles[3],
  },
  {
    eventId: "evt011",
    eventTitle: "Cultural Exchange Night",
    eventPoster: "https://placehold.co/400x250?text=Exchange+Night",
    storageId: "evt011",
    attending: 160,
    hasVolunteerOption: true,
    description: [
      {
        time: "Nov 12, 2025 - 6:00 PM",
        place: "Auditorium A",
        desc: "Students showcase dances, music, and traditions from different countries.",
      },
    ],
    date: "2025-11-12",
    club: mockClubProfiles[3],
  },
  {
    eventId: "evt012",
    eventTitle: "Language Meetup",
    eventPoster: "https://placehold.co/400x250?text=Languages",
    storageId: "evt012",
    attending: 65,
    description: [
      {
        time: "Dec 5, 2025 - 4:00 PM",
        place: "Student Center",
        desc: "Practice new languages with native speakers in a relaxed environment.",
      },
    ],
    date: "2025-12-05",
    club: mockClubProfiles[3],
  },

  // ECO CLUB EVENTS
  {
    eventId: "evt013",
    eventTitle: "Campus Clean-Up Drive",
    eventPoster: "https://placehold.co/400x250?text=Clean-Up",
    storageId: "evt013",
    attending: 90,
    hasVolunteerOption: true,
    description: [
      {
        time: "Oct 18, 2025 - 9:00 AM",
        place: "Main Campus",
        desc: "Join us for a clean-up drive to make our campus greener.",
      },
    ],
    date: "2025-10-18",
    club: mockClubProfiles[4],
  },
  {
    eventId: "evt014",
    eventTitle: "Tree Planting Day",
    eventPoster: "https://placehold.co/400x250?text=Tree+Planting",
    storageId: "evt014",
    attending: 80,
    description: [
      {
        time: "Nov 20, 2025 - 10:00 AM",
        place: "Botanical Garden",
        desc: "Plant trees around campus and contribute to a sustainable future.",
      },
    ],
    date: "2025-11-20",
    club: mockClubProfiles[4],
  },
  {
    eventId: "evt015",
    eventTitle: "Recycling Workshop",
    eventPoster: "https://placehold.co/400x250?text=Recycling",
    storageId: "evt015",
    attending: 65,
    hasVolunteerOption: false,
    description: [
      {
        time: "Dec 15, 2025 - 2:00 PM",
        place: "Eco Lab",
        desc: "Learn the art of recycling and upcycling everyday materials.",
      },
    ],
    date: "2025-12-15",
    club: mockClubProfiles[4],
  },
];
