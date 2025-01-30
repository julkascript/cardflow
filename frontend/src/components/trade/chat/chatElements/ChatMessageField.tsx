import { Button, TextField } from '@mui/material';
import { theme } from '../../../../constants/theme';
import { useState } from 'react';
import { SendTradeChatMessage, TradeParticipant } from '../../../../services/trade/types';
import { tradeService } from '../../../../services/trade/trade';
import { useToast } from '../../../../util/useToast';

type ChatMessageFieldProps = {
  otherUser: TradeParticipant;
  tradeId: number;
  onMessageSent: () => void;
};

function ChatMessageField(props: ChatMessageFieldProps): JSX.Element {
  const toast = useToast();
  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const messageBody: SendTradeChatMessage = {
      message,
    };

    setDisabled(true);

    tradeService
      .sendMessage(props.tradeId, messageBody)
      .then(() => {
        setMessage('');
        props.onMessageSent();
      })
      .catch(toast.error)
      .finally(() => setDisabled(false));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setMessage(event.target.value);
  }

  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(false);

  return (
    <form className="p-4 flex flex-col lg:flex-row gap-2" onSubmit={onSubmit}>
      <TextField
        placeholder={`Message to ${props.otherUser.username}`}
        className="w-full"
        multiline
        value={message}
        onChange={handleChange}
        disabled={disabled}
      />
      <Button
        type="submit"
        disabled={!message || disabled}
        sx={{
          backgroundColor: 'rgba(0, 114, 245, 1)',
          color: 'white',
          ':hover': { color: 'black', backgroundColor: theme.palette.info.main },
          ':disabled': { backgroundColor: 'gray', color: 'white', opacity: '0.4' },
        }}
      >
        Send
      </Button>
    </form>
  );
}

export default ChatMessageField;
