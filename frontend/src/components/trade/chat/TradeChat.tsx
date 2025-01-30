import { useTrade } from '../../../context/trade';
import { useCurrentUser } from '../../../context/user';
import { TradeChatMessage } from '../../../services/trade/types';
import PageSection from '../../PageSection';
import ChatMessage from './chatElements/ChatMessage';
import ChatMessageField from './chatElements/ChatMessageField';

type TradeChatProps = {
  messages: TradeChatMessage[];
  onMessageSent: () => void;
};

function TradeChat(props: TradeChatProps): JSX.Element {
  const { trade } = useTrade();
  const { user } = useCurrentUser();

  const otherUser = trade.recipient.id === user.user_id ? trade.recipient : trade.initiator;
  return (
    <PageSection className="w-3/4 lg:w-1/2">
      <div className="p-4 flex flex-col h-[450px] lg:h-[682px] overflow-y-auto gap-8">
        {props.messages.map((message) => (
          <ChatMessage message={message} key={message.id} />
        ))}
      </div>
      <ChatMessageField
        onMessageSent={props.onMessageSent}
        otherUser={otherUser}
        tradeId={trade.id}
      />
    </PageSection>
  );
}

export default TradeChat;
