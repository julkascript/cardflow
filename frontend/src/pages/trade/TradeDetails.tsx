import { useContext, useEffect, useState } from 'react';
import { TradeContext } from '../../context/trade';
import TradeModal from '../../components/trade/modal/TradeModal';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { tradeService } from '../../services/trade/trade';
import { useParams } from 'react-router-dom';

function TradeDetails(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { populate } = useContext(TradeContext);
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    tradeService.findTradeById(id).then((data) => {
      const recipientRequests = data.recipient_listing.map((l) => yugiohService.getListingById(l));
      const initiatorRequests = data.initiator_listing.map((l) => yugiohService.getListingById(l));

      Promise.all([...recipientRequests, ...initiatorRequests]).then((listings) => {
        const initiatorListings = listings.filter((l) => l.user === data.initiator.id);
        const recipientListings = listings.filter((l) => l.user === data.recipient.id);

        populate({
          ...data,
          initiator_listing: initiatorListings,
          recipient_listing: recipientListings,
        });

        setOpen(true);
      });
    });
  }, []);

  /* TO-DO: update with chat PR */
  return (
    <main>
      <TradeModal id={id} open={open} onClose={() => setOpen(false)} />
      <h1>Details</h1>
    </main>
  );
}

export default TradeDetails;
