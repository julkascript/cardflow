import PageSection from '../../PageSection';
import ChatMessage from './chatElements/ChatMessage';
import { TradeChatMessageProps } from './chatElements/messages/messageProps';

type TradeChatProps = {
  messages: TradeChatMessageProps[];
};

function TradeChat(props: TradeChatProps): JSX.Element {
  return (
    <PageSection>
      {props.messages.map((message) => (
        <ChatMessage {...message} key={message.message.id} />
      ))}
    </PageSection>
  );
}

export default TradeChat;
