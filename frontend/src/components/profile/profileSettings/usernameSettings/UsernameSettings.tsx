import { Button, TextField } from '@mui/material';
import PageSection from '../../../pageSection/PageSection';
import ProfileSectionFooter from '../../profileSectionFooter/ProfileSectionFooter';
import './UsernameSettings.css';
import { ChangeEvent, useState } from 'react';

const maxLength = 48;

function UsernameSettings(): JSX.Element {
  const [username, setUsername] = useState('');

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;

    if (value.length <= maxLength) {
      setUsername(value);
    }
  }

  return (
    <PageSection>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
        <div>
          <h2 className="font-bold mb-4 text-lg">Username</h2>
          <p className="mb-4">This is how people will recognize you.</p>
          <div>
            <TextField
              className="user-url-field lg:w-[165px]"
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
              helperText={`${username.length} / ${maxLength}`}
            />
          </div>
        </div>
      </div>
      <ProfileSectionFooter>
        <p>Please use {maxLength} characters at maximum.</p>
        <Button
          disabled={username === ''}
          color="primary"
          variant="contained"
          className="inline-block"
        >
          Save
        </Button>
      </ProfileSectionFooter>
    </PageSection>
  );
}

export default UsernameSettings;
