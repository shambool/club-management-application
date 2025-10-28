export type ClubProfile = {
  clubId: string;      // mapped from DB id
  slug?: string;
  clubName: string;
  description: string;
  clubLogo?: string | null;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};