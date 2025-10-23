import { EventDescription } from "./eventDescribtion";
import { ClubProfile } from "./clubProfile";


export type Event = {
  club: ClubProfile;   
  eventId: string;       // unique event identifier
  eventTitle: string;
  eventPoster: string;
  storageId: string;      // used for deletion / Firebase reference
  attending: number;      // number of attendees
  hasVolunteerOption?: boolean; // if the event has a volunteer option
  description: EventDescription[];
  date: string;
};
