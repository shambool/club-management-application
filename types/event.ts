import { EventDescription } from "./eventDescribtion";
import { Club } from "./clubProfile";


export type Event = {
  club: Club;          // club president or event creator
  eventTitle: string;
  eventPoster: string;
  storageId: string;      // used for deletion / Firebase reference
  attending: number;      // number of attendees
  hasVolunteerOption?: boolean; // if the event has a volunteer option
  description: EventDescription[];
};
