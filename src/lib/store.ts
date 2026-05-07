import { Invitation, Guest, GuestInvite } from "./types";

// Mock store using localStorage (simulated for server-side safety in Next.js)
export const getInvitations = (): Invitation[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("invitations");
  return stored ? JSON.parse(stored) : [];
};

export const saveInvitation = (invitation: Invitation) => {
  const invitations = getInvitations();
  invitations.push(invitation);
  localStorage.setItem("invitations", JSON.stringify(invitations));
};

export const getInvitationById = (id: string): Invitation | undefined => {
  return getInvitations().find((inv) => inv.id === id);
};

export const getGuests = (invitationId: string): Guest[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`guests_${invitationId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveGuest = (guest: Guest) => {
  const guests = getGuests(guest.invitationId);
  const index = guests.findIndex((g) => g.id === guest.id);
  if (index >= 0) {
    guests[index] = guest;
  } else {
    guests.push(guest);
  }
  localStorage.setItem(`guests_${guest.invitationId}`, JSON.stringify(guests));
};

export const getGuestInvites = (invitationId: string): GuestInvite[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`guest_invites_${invitationId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveGuestInvite = (invite: GuestInvite) => {
  if (typeof window === "undefined") return;
  const invites = getGuestInvites(invite.invitationId);
  invites.push(invite);
  localStorage.setItem(
    `guest_invites_${invite.invitationId}`,
    JSON.stringify(invites),
  );
};
