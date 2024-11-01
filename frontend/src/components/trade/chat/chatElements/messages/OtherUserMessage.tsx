import { Typography } from '@mui/material';
import { TradeChatMessageProps } from './messageProps';
import ExpandOffer from './ExpandOffer';
import { useTrade } from '../../../../../context/trade';
import { useTranslation } from 'react-i18next';

function OtherUserMessage(props: TradeChatMessageProps): JSX.Element {
  const { setModalIsOpen } = useTrade();
  const { t } = useTranslation('trade');

  const isSystem = props.message.sender_type === 'system';

  return (
    <div>
      <div className="bg-[#e8daf5] px-2 py-4 rounded-xl rounded-bl-none inline-flex flex-col gap-2">
        <div style={{ wordBreak: 'break-word' }}>{props.message.message}</div>
        {isSystem ? <ExpandOffer onExpandOffer={() => setModalIsOpen(true)} /> : null}
      </div>
      {isSystem ? (
        <Typography className="pl-4" color="text.secondary" fontWeight="bold">
          {t('details.chat.system')}
        </Typography>
      ) : null}
    </div>
  );
}

export default OtherUserMessage;
