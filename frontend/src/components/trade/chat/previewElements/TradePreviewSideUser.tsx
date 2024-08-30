import { tradeStatusResult } from '../../../../constants/tradeStatus';
import { TradeParticipant } from '../../../../services/trade/types';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AcceptIcon from '@mui/icons-material/Check';
import RejectIcon from '@mui/icons-material/Clear';
import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../constants/theme';

type TradePreviewSideUserProps = {
  user: TradeParticipant;
  decision: tradeStatusResult;
};

const statusBadges: Record<tradeStatusResult, React.ReactNode> = {
  pending: <MoreHorizIcon color="secondary" />,
  accept: <AcceptIcon color="success" />,
  reject: <RejectIcon color="error" />,
};

const statusBorderColor: Record<tradeStatusResult, string> = {
  accept: theme.palette.success.main,
  pending: theme.palette.grey[300],
  reject: theme.palette.error.main,
};

function TradePreviewSideUser(props: TradePreviewSideUserProps): JSX.Element {
  const { t } = useTranslation('trade');
  return (
    <div className="flex items-center gap-2">
      <Avatar
        sx={{ borderColor: statusBorderColor[props.decision] }}
        className="border-2"
        src={props.user.avatar || ''}
        alt={props.user.username}
      />
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
