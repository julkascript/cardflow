import PageSection from '../../PageSection';
import ChatMessage from './chatElements/ChatMessage';
import { TradeChatMessageProps } from './chatElements/messages/messageProps';

type TradeChatProps = {
  messages: TradeChatMessageProps[];
};

function TradeChat(props: TradeChatProps): JSX.Element {
  return (
    <PageSection className="w-3/4 lg:w-1/2">
      <div className="p-4 flex flex-col lg:h-[682px] overflow-y-auto gap-8">
        {props.messages.map((message) => (
          <ChatMessage {...message} key={message.message.id} />
        ))}
      </div>
    </PageSection>
  );
}

export default TradeChat;
