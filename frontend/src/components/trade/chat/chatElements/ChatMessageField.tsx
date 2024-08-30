import { Button, TextField } from '@mui/material';
import { theme } from '../../../../constants/theme';
import { useState } from 'react';
import { TradeParticipant } from '../../../../services/trade/types';

type ChatMessageFieldProps = {
  otherUser: TradeParticipant;
};

function ChatMessageField(props: ChatMessageFieldProps): JSX.Element {
  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setMessage(event.target.value);
  }

  const [message, setMessage] = useState('');

  return (
    <form className="p-4 flex flex-col lg:flex-row gap-2" onSubmit={onSubmit}>
      <TextField
        placeholder={`Message to ${props.otherUser.username}`}
        className="w-full"
        multiline
        value={message}
        onChange={handleChange}
      />
      <Button
        type="submit"
        disabled={!message}
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
