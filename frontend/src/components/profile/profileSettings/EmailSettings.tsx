import { Button, TextField } from '@mui/material';
import PageSection from '../../PageSection';
import ProfileSectionFooter from '../ProfileSectionFooter';
import { ChangeEvent, useState } from 'react';

type EmailSettingsProps = {
  email: string;
};

function EmailSettings(props: EmailSettingsProps): JSX.Element {
  const [email, setEmail] = useState(props.email);
  const emailPattern = /^.+@.+$/gim;

  const isInvalid = !emailPattern.test(email) || email === props.email;

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setEmail(value);
  }

  return (
    <PageSection>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
        <h2 className="font-bold mb-4 text-lg">Email</h2>
        <p className="mb-4">Please enter your email address.</p>
        <TextField value={email} onChange={handleEmailChange} size="small" />
      </div>
      <ProfileSectionFooter>
        <p>We will email you to verify the change.</p>
        <Button disabled={isInvalid} color="primary" variant="contained" className="inline-block">
          Save
        </Button>
      </ProfileSectionFooter>
    </PageSection>
  );
}

export default EmailSettings;
