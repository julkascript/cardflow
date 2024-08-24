import { type TradeOffer } from '../context/trade';

export function offersAreTheSame(current: TradeOffer, initial: TradeOffer): boolean {
  if (Number(current.initiator_cash) !== Number(initial.initiator_cash)) {
    return false;
  }

  if (Number(current.recipient_cash) !== Number(initial.recipient_cash)) {
    return false;
  }

  if (current.initiator_listing.length !== initial.initiator_listing.length) {
    return false;
  }

  if (current.recipient_listing.length !== initial.recipient_listing.length) {
    return false;
  }

  for (const listing of current.initiator_listing) {
    const oldListing = initial.initiator_listing.find((l) => l.id === listing.id);
    if (!oldListing) {
      return false;
    }
  }

  for (const listing of current.recipient_listing) {
    const oldListing = initial.recipient_listing.find((l) => l.id === listing.id);
    if (!oldListing) {
      return false;
    }
  }

  return true;
}
