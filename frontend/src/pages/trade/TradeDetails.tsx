import { useEffect, useState } from 'react';
import { useTrade } from '../../context/trade';
import TradeModal from '../../components/trade/modal/TradeModal';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { tradeService } from '../../services/trade/trade';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../util/useToast';
import { toastMessages } from '../../constants/toast';
import { Trade, TradeChatData, TradeRequest } from '../../services/trade/types';
import { HttpError } from '../../util/HttpError';
import CardflowTabs from '../../components/cardflowTabs/CardflowTabs';
import BreadcrumbNavigation from '../../components/BreadcrumbNavigation';
import { useTranslation } from 'react-i18next';
import TradeChat from '../../components/trade/chat/TradeChat';
import TradePreview from '../../components/trade/chat/TradePreview';

function TradeDetails(): JSX.Element {
  const { trade, populate, modalIsOpen, setModalIsOpen } = useTrade();
  const toast = useToast();
  const params = useParams();
  const id = Number(params.id);
  const navigate = useNavigate();
  const { t: commonT } = useTranslation('common');

  const [tradeChatData, setTradeChatData] = useState<TradeChatData>({
    created_at: '',
    trade_id: 0,
    id: 0,
    messages: [],
  });

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

        setModalIsOpen(false);
        updateChatMessages();
        return tradeService.findTradeById(id);
      })
      .then(transformOffer)
      .then(populate)
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

        setModalIsOpen(false);
        updateChatMessages();
        return tradeService.findTradeById(id);
      })
      .then(transformOffer)
      .then(populate)
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
        setModalIsOpen(false);
        updateChatMessages();
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
        setModalIsOpen(true);
        return updateChatMessages();
      })
      .catch((err) => {
        if (err instanceof HttpError && err.err.status === 404) {
          navigate('/not-found');
        } else {
          toast.error(err);
        }
      });
  }, []);

  function updateChatMessages() {
    tradeService.retrieveTradeChatMessages(id).then(setTradeChatData);
  }

  return (
    <section className="bg-[#F5F5F5]">
      <CardflowTabs />
      <BreadcrumbNavigation
        links={[{ href: '/trade', text: commonT('breadcrumbs.trade.title') }]}
        heading={`TR-${id}`}
      />
      <div className="flex flex-col items-center lg:flex-row lg:justify-center gap-6 lg:items-start">
        <TradeChat onMessageSent={updateChatMessages} messages={tradeChatData.messages} />
        <TradePreview onAccept={accept} onReject={reject} />
      </div>
      <TradeModal
        id={id}
        onNegotiate={negotiate}
        onReject={reject}
        onAccept={accept}
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </section>
  );
}

export default TradeDetails;
