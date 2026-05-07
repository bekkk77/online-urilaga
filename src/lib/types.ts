export type EventType = "wedding" | "birthday" | "graduation" | "other";

export interface Invitation {
  id: string;
  type: EventType;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  host: string;
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  status: "going" | "not-going" | "maybe";
  checkedIn: boolean;
}

export interface GuestInvite {
  id: string;
  invitationId: string;
  email: string;
  link: string;
  sentAt: string;
}
