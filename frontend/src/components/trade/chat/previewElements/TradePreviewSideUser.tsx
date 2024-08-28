import { tradeStatusResult } from '../../../../constants/tradeStatus';
import { TradeParticipant } from '../../../../services/trade/types';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AcceptIcon from '@mui/icons-material/Check';
import RejectIcon from '@mui/icons-material/Clear';
import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

type TradePreviewSideUserProps = {
  user: TradeParticipant;
  decision: tradeStatusResult;
};

const statusBadges: Record<tradeStatusResult, React.ReactNode> = {
  pending: <MoreHorizIcon color="secondary" />,
  accept: <AcceptIcon color="success" />,
  reject: <RejectIcon color="error" />,
};

function TradePreviewSideUser(props: TradePreviewSideUserProps): JSX.Element {
  const { t } = useTranslation('trade');
  return (
    <div>
      <Avatar src={props.user.avatar || ''} alt={props.user.username} />
      <Tooltip
        title={t('details.preview.statusBadge.status', {
          username: props.user.username,
          context: props.decision,
        })}
      >
        <IconButton>{statusBadges[props.decision]}</IconButton>
      </Tooltip>
    </div>
  );
}

export default TradePreviewSideUser;
