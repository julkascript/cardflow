import { createContext, useContext, useState } from 'react';
import { YugiohCardListing } from '../services/yugioh/types';
import { Trade } from '../services/trade/types';

type TradeItemOption = YugiohCardListing | number;

export type TradeOffer = Omit<Trade, 'recipient_listing' | 'initiator_listing'> & {
  recipient_listing: YugiohCardListing[];
  initiator_listing: YugiohCardListing[];
};

type TradeContextType = {
  trade: TradeOffer;
  initialTradeOffer: TradeOffer;
  addRecipientListingOrCash: (listing: TradeItemOption) => void;
  addInitiatorListingOrCash: (listing: TradeItemOption) => void;
  removeRecipientListingOrCash: (listing: TradeItemOption) => void;
  removeInitiatorListingOrCash: (listing: TradeItemOption) => void;
  populate: (data: TradeOffer) => void;
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialState: TradeOffer = {
  id: 0,
  trade_status: 'negotiate',
  initiator_decision: 'accept',
  recipient_decision: 'pending',
  recipient_listing: [],
  recipient_cash: 0,
  initiator_listing: [],
  initiator_cash: 0,
  recipient: {
    id: 0,
    username: '',
    email: null,
    avatar: null,
  },
  initiator: {
    id: 0,
    username: '',
    email: null,
    avatar: null,
  },
};

export const TradeContext = createContext<TradeContextType>({
  trade: initialState,
  initialTradeOffer: initialState,
  addInitiatorListingOrCash: () => {},
  addRecipientListingOrCash: () => {},
  removeRecipientListingOrCash: () => {},
  removeInitiatorListingOrCash: () => {},
  populate: () => {},
  modalIsOpen: false,
  setModalIsOpen: () => {},
});

export function TradeContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [trade, setTrade] = useState<TradeOffer>(initialState);
  const [initialTradeOffer, setInitialTradeOffer] = useState<TradeOffer>(initialState);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function addRecipientListingOrCash(item: TradeItemOption) {
    if (typeof item === 'number') {
      setTrade((t) => ({ ...t, recipient_cash: item, offerHasChanged: true }));
    } else {
      setTrade((t) => ({
        ...t,
        recipient_listing: [...t.recipient_listing, item],
      }));
    }
  }

  function addInitiatorListingOrCash(item: TradeItemOption) {
    if (typeof item === 'number') {
      setTrade((t) => ({ ...t, initiator_cash: item, offerHasChanged: true }));
    } else {
      setTrade((t) => ({
        ...t,
        initiator_listing: [...t.initiator_listing, item],
      }));
    }
  }

  function removeInitiatorListingOrCash(item: TradeItemOption) {
    if (typeof item === 'number') {
      setTrade((t) => ({ ...t, initiator_cash: null, offerHasChanged: true }));
    } else {
      setTrade((t) => ({
        ...t,
        initiator_listing: t.initiator_listing.filter((l) => l.id !== item.id),
      }));
    }
  }

  function removeRecipientListingOrCash(item: TradeItemOption) {
    if (typeof item === 'number') {
      setTrade((t) => ({ ...t, recipient_cash_cash: null, offerHasChanged: true }));
    } else {
      setTrade((t) => ({
        ...t,
        recipient_listing: t.recipient_listing.filter((l) => l.id !== item.id),
      }));
    }
  }

  function populate(data: TradeOffer) {
    setTrade(data);
    setInitialTradeOffer(data);
  }

  return (
    <TradeContext.Provider
      value={{
        trade,
        initialTradeOffer,
        addInitiatorListingOrCash,
        addRecipientListingOrCash,
        removeInitiatorListingOrCash,
        removeRecipientListingOrCash,
        populate,
        modalIsOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export const useTrade = () => {
  const trade = useContext(TradeContext);
  return trade;
};
