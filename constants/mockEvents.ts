import type { Event } from '../types/event';

export const mockEvents: Event[] = [
  {
    club: {
      clubId: 'club123',
      clubName: 'Tech Innovators',
      clubLogo: 'https://placehold.co/100x100',
    },
    eventTitle: 'AI & Robotics Expo',
    eventPoster: 'https://placehold.co/400x250',
    storageId: 'evt001',
    attending: 87,
    description: [
      {
        time: 'Oct 20, 2025 - 10:00 AM',
        place: 'Tech Hall A',
        desc: 'Explore the latest innovations in AI and robotics!',
      },
    ],
  },
  {
    club: {
      clubId: 'club456',
      clubName: 'Health & Wellness Club',
      clubLogo: 'https://placehold.co/100x100',
    },
    eventTitle: 'Yoga & Meditation Session',
    eventPoster: 'https://placehold.co/400x250',
    storageId: 'evt002',
    attending: 45,
    hasVolunteerOption: true,
    description: [
      {
        time: 'Nov 5, 2025 - 8:00 AM',
        place: 'Wellness Center',
        desc: 'Start your day with a refreshing yoga and meditation session.',
      },
    ],
  },
  {
    club: {
      clubId: 'club789',
      clubName: 'Cultural Exchange Club',
      clubLogo: 'https://placehold.co/100x100',
    },
    eventTitle: 'International Food Festival',
    eventPoster: 'https://placehold.co/400x250',
    storageId: 'evt003',
    attending: 120,
    description: [
      {
        time: 'Dec 12, 2025 - 12:00 PM',
        place: 'Main Campus Lawn',
        desc: 'Taste dishes from around the world and celebrate cultural diversity.',
      },
    ],
  },
  
]