import { EventDescription } from "./eventDescribtion";
import { ClubProfile } from "./clubProfile";


export type Event = {
  eventId: string;       // unique event identifier
  eventTitle: string;
  eventPoster: string;
  attending: number;      // number of attendees
  hasVolunteerOption?: boolean; // if the event has a volunteer option
  startDate: string;    // ISO date string
  duration: string;
  place: string;
  desc: string;
  club: ClubProfile;  
  externalLink?: string; 
  Attendee_points?: number; 
  Volunteer_points?: number; 
  createdAt: string;
};


