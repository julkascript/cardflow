import { Avatar, Button, Typography, styled, useTheme } from '@mui/material';
import PageSection from '../../../PageSection';
import { FormEvent, useState } from 'react';
import { handleAvatarUpload } from './handleAvatarUpload';
import ProfileSectionFooter from '../../ProfileSectionFooter';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type AvatarSettingsProps = {
  avatar: string | null;
  onSubmit: (avatar: File) => void;
};

function AvatarSettings(props: AvatarSettingsProps): JSX.Element {
  const [imageUpload, setImageUpload] = useState(props.avatar || '');
  const [imageError, setImageError] = useState('');
  const [file, setFile] = useState<File>();
  const [hasSelected, setSelected] = useState(false);

  const theme = useTheme();
  const error = theme.palette.error.main;

  function changeAvatarPreview(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      handleAvatarUpload(file)
        .then((result) => {
          setImageError('');
          setImageUpload(result);
          setFile(file);
        })
        .catch((err) => {
          setImageError(err);
          setImageUpload('');
        })
        .finally(() => setSelected(true));
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (file) {
      props.onSubmit(file);
    }
  }

  return (
    <PageSection>
      <form onSubmit={handleSubmit}>
        <div className="pt-4 pb-4 lg:pl-12 lg:pr-12 flex flex-col-reverse lg:justify-between lg:flex-row">
          <div>
            <h2 className="font-bold mb-4 text-lg">Avatar</h2>
            <p>Select your avatar by clicking on the avatar circle.</p>
            <Typography
              component="p"
              color={error}
              className={imageError ? 'visible' : 'invisible'}
            >
              {imageError || 'Your file is valid!'}
            </Typography>
          </div>
          <div className="relative flex flex-row mb-2 lg:mb-0 gap-4 flex-wrap justify-center lg:justify-normal">
            <label>
              <Avatar
                className="cursor-pointer hover:opacity-50 z-10"
                src={imageUpload}
                sx={{ width: 80, height: 80 }}
              />
              <VisuallyHiddenInput
                aria-label="Select an image to use as your avatar"
                type="file"
                onChange={changeAvatarPreview}
                id="avatar"
                accept="image/*"
              />
            </label>
          </div>
        </div>
        <ProfileSectionFooter>
          <p>An avatar is optional but strongly recommended.</p>
          <Button
            disabled={!(imageError === '' && hasSelected)}
            color="primary"
            variant="contained"
            className="inline-block"
            type="submit"
          >
            Save
          </Button>
        </ProfileSectionFooter>
      </form>
    </PageSection>
  );
}

export default AvatarSettings;
