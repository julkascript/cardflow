import { Typography } from '@mui/material';
import { TradeChatMessageProps } from './messageProps';
import ExpandOffer from './ExpandOffer';
import { useTrade } from '../../../../../context/trade';

function OwnMessage(props: TradeChatMessageProps): JSX.Element {
  const { setModalIsOpen } = useTrade();
  return (
    <div>
      <div className="bg-[#e8daf5]">
        <div>{props.message.content}</div>
        {props.message.isSystem ? <ExpandOffer onExpandOffer={() => setModalIsOpen(true)} /> : null}
      </div>
      {props.message.isSystem ? (
        <Typography color="text.secondary" fontWeight="bold">
          System
        </Typography>
      ) : null}
    </div>
  );
}

export default OwnMessage;
