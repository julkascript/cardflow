import PageSection from '../../PageSection';
import ChatMessage from './chatElements/ChatMessage';
import { TradeChatMessageProps } from './chatElements/messages/messageProps';

type TradeChatProps = {
  messages: TradeChatMessageProps[];
};

function TradeChat(props: TradeChatProps): JSX.Element {
  return (
    <PageSection className="w-1/2 lg:h-[682px] overflow-y-auto">
      {props.messages.map((message) => (
        <ChatMessage {...message} key={message.message.id} />
      ))}
    </PageSection>
  );
}

export default TradeChat;
