import { useCurrentUser } from '../../../../context/user';
import { TradeChatMessageProps } from './messages/messageProps';
import OtherUserMessage from './messages/OtherUserMessage';
import OwnMessage from './messages/OwnMessage';

function ChatMessage(props: TradeChatMessageProps): JSX.Element {
  const { user } = useCurrentUser();

  if (user.user_id === props.message.userId) {
    return <OwnMessage message={props.message} />;
  }

  return <OtherUserMessage message={props.message} />;
}

export default ChatMessage;
