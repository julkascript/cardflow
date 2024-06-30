import { Button, TextField } from '@mui/material';
import PageSection from '../../../PageSection';
import ProfileSectionFooter from '../../ProfileSectionFooter';
import './UsernameSettings.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usernameValidationRules } from '../../../../constants/validationRules/username';

type UsernameSettingsProps = {
  username: string;
  onSubmit: (username: string) => void;
};

function UsernameSettings(props: UsernameSettingsProps): JSX.Element {
  const [username, setUsername] = useState(props.username);
  const { t } = useTranslation('account');

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;

    if (value.length <= usernameValidationRules.maxLength) {
      setUsername(value);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    props.onSubmit(username);
  }

  return (
    <PageSection>
      <form onSubmit={handleSubmit}>
        <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
          <div>
            <h2 className="font-bold mb-4 text-lg">{t('details.username.title')}</h2>
            <p className="mb-4">{t('details.username.description')}</p>
            <div>
              <TextField
                className="user-url-field sm:w-[165px]"
                size="small"
                sx={{ backgroundColor: '#F5F5F5' }}
                disabled
                value="cardflow.com/user/"
              />
              <TextField
                className="username-field"
                size="small"
                value={username}
                onChange={handleUsernameChange}
                helperText={`${username.length} / ${usernameValidationRules.maxLength}`}
              />
            </div>
          </div>
        </div>
        <ProfileSectionFooter>
          <p>{t('details.username.hint', { usernameValidationRules })}</p>
          <Button
            disabled={username === '' || username === props.username}
            color="primary"
            variant="contained"
            className="inline-block"
            type="submit"
          >
            {t('common.saveButtonText')}
          </Button>
        </ProfileSectionFooter>
      </form>
    </PageSection>
  );
}

export default UsernameSettings;
