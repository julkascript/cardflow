import { Typography } from '@mui/material';
import { TradeChatMessageProps } from './messageProps';
import ExpandOffer from './ExpandOffer';
import { useTrade } from '../../../../../context/trade';
import { useTranslation } from 'react-i18next';

function OwnMessage(props: TradeChatMessageProps): JSX.Element {
  const { setModalIsOpen } = useTrade();
  const { t } = useTranslation('trade');

  return (
    <div className="flex flex-col">
      <div className="bg-[#f5efdb] px-2 py-4 rounded-xl rounded-br-none inline-flex flex-col ml-auto gap-2">
        <div className="" style={{ wordBreak: 'break-word' }}>
          {props.message.content}
        </div>
        {props.message.isSystem ? <ExpandOffer onExpandOffer={() => setModalIsOpen(true)} /> : null}
      </div>
      {props.message.isSystem ? (
        <Typography className="text-right pr-4" color="text.secondary" fontWeight="bold">
          {t('details.chat.system')}
        </Typography>
      ) : null}
    </div>
  );
}

export default OwnMessage;
