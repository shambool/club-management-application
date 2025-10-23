export type ClubProfile = {
  clubId: string;            // unique club identifier (e.g., "ai", "sports", "art")
  clubName: string;          // display name
  clubLogo: string;          // small image/logo
  description: string;       // about the club
  currentScore: number;      // score this semester
  semesterScore: number;     // total score across semesters
  presidentId: string;       // ID of the club president
  eventIds: string[];        // list of event storageIds owned by this club
};