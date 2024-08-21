import { useEffect, useState } from 'react';
import { useTrade } from '../../context/trade';
import TradeModal from '../../components/trade/modal/TradeModal';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { tradeService } from '../../services/trade/trade';
import { useParams } from 'react-router-dom';
import { useToast } from '../../util/useToast';
import { toastMessages } from '../../constants/toast';
import { Trade, TradeRequest } from '../../services/trade/types';

function TradeDetails(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { trade, populate } = useTrade();
  const toast = useToast();
  const params = useParams();
  const id = Number(params.id);

  function accept() {
    tradeService
      .accept(id)
      .then((data) => {
        if (data.status === 'accepted') {
          toast.success({
            toastKey: toastMessages.tradeHasBeenAccepted,
            values: {
              id,
            },
          });
        }

        setOpen(false);
      })
      .catch(toast.error);
  }

  function reject() {
    tradeService
      .reject(id)
      .then((data) => {
        if (data.status === 'rejected') {
          toast.success({
            toastKey: toastMessages.tradeHasBeenRejected,
            values: {
              id,
            },
          });
        }

        setOpen(false);
      })
      .catch(toast.error);
  }

  function negotiate() {
    const offer: Partial<TradeRequest> = {
      recipient_id: trade.recipient.id,
      initiator_id: trade.initiator.id,
      recipient_listing: trade.recipient_listing.map((l) => l.id),
      initiator_listing: trade.initiator_listing.map((l) => l.id),
      initiator_cash: trade.initiator_cash || 0,
      recipient_cash: trade.recipient_cash || 0,
    };

    tradeService
      .negotiate(id, offer)
      .then(transformOffer)
      .then((data) => {
        populate(data);
        setOpen(false);
        toast.success({ toastKey: toastMessages.tradeHasBeenNegotiated, values: { id } });
      })
      .catch(toast.error);
  }

  async function transformOffer(data: Trade) {
    const recipientRequests = data.recipient_listing.map((l) => yugiohService.getListingById(l));
    const initiatorRequests = data.initiator_listing.map((l) => yugiohService.getListingById(l));

    return Promise.all([...recipientRequests, ...initiatorRequests]).then((listings) => {
      const initiatorListings = listings.filter((l) => l.user === data.initiator.id);
      const recipientListings = listings.filter((l) => l.user === data.recipient.id);

      return {
        ...data,
        initiator_listing: initiatorListings,
        recipient_listing: recipientListings,
      };
    });
  }

  useEffect(() => {
    tradeService
      .findTradeById(id)
      .then(transformOffer)
      .then((data) => {
        populate(data);
        setOpen(true);
      })
      .catch(toast.error);
  }, []);

  /* TO-DO: update with chat PR */
  return (
    <main>
      <TradeModal
        id={id}
        onNegotiate={negotiate}
        onReject={reject}
        onAccept={accept}
        open={open}
        onClose={() => setOpen(false)}
      />
      <h1>Details</h1>
    </main>
  );
}

export default TradeDetails;
