import PageSection from '../../PageSection';
import ChatMessage from './chatElements/ChatMessage';
import ChatMessageField from './chatElements/ChatMessageField';
import { TradeChatMessageProps } from './chatElements/messages/messageProps';

type TradeChatProps = {
  messages: TradeChatMessageProps[];
};

function TradeChat(props: TradeChatProps): JSX.Element {
  return (
    <PageSection className="w-3/4 lg:w-1/2">
      <div className="p-4 flex flex-col h-[450px] lg:h-[682px] overflow-y-auto gap-8">
        {props.messages.map((message) => (
          <ChatMessage {...message} key={message.message.id} />
        ))}
      </div>
      <ChatMessageField />
    </PageSection>
  );
}

export default TradeChat;
