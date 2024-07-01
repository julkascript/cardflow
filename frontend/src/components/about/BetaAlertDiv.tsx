import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

type BetaAlertDivProps = {
  setAlertVisible: (isVisible: boolean) => void;
};

const BetaAlertDiv: React.FC<BetaAlertDivProps> = ({ setAlertVisible }) => {
  const { t } = useTranslation('about');

  const handleClose = () => {
    setAlertVisible(false);
  };
  return (
    <Alert
      id="closable-alert"
      severity="info"
      action={
        <Button
          aria-label="close"
          sx={{ borderRadius: '8px', minWidth: '24px' }}
          onClick={handleClose}
        >
          <CloseIcon sx={{ fontSize: '16px' }} />
        </Button>
      }
      sx={{
        fontSize: '18px',
        width: '83.33%',
        margin: '16px auto',
        bgcolor: '#E5F6FD',
        display: 'flex',
        color: '#000',
        fontWeight: '300',
        border: '1px solid #666',
        borderRadius: '8px',
        alignItems: 'center',
        '.MuiAlert-icon': {
          fontSize: 30,
        },
      }}
    >
      {t('main.betaWarningFirstPart')}{' '}
      <a
        href="http://localhost:5173/about/contact"
        target="_blank"
        style={{ textDecoration: 'underline' }}
      >
        {t('main.report')}
      </a>{' '}
      {t('main.betaWarningSecondPart')}
    </Alert>
  );
};

export default BetaAlertDiv;
