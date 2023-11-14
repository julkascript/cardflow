import { Avatar, Button, Typography, styled, useTheme } from '@mui/material';
import PageSection from '../../../pageSection/PageSection';
import { useState } from 'react';
import { handleAvatarUpload } from './handleAvatarUpload';

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

function AvatarSettings(): JSX.Element {
  const [imageUpload, setImageUpload] = useState('');
  const [imageError, setImageError] = useState('');
  const [hasSelected, setSelected] = useState(false);

  const theme = useTheme();
  const danger = theme.palette.warning.main;

  function changeAvatarPreview(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const file = files[0];

    handleAvatarUpload(file)
      .then((result) => {
        setImageError('');
        setImageUpload(result);
      })
      .catch((err) => {
        setImageError(err);
        setImageUpload('');
      })
      .finally(() => setSelected(true));
  }

  return (
    <PageSection>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12 flex flex-col-reverse lg:justify-between lg:flex-row">
        <div>
          <h2 className="font-bold mb-4">Avatar</h2>
          <p>Select your avatar by clicking on the avatar circle.</p>
          <Typography component="p" color={danger} className={imageError ? 'visible' : 'invisible'}>
            {imageError}
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
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between">
        <Typography
          color="text.secondary"
          component="div"
          className="bg-[#F5F5F5] rounded-lg rounded-t-none w-full"
        >
          <div className="flex p-4 pl-12 pr-12 flex-col lg:flex-row gap-2 justify-center lg:justify-between items-center">
            <p>An avatar is optional but strongly recommended.</p>
            <Button
              disabled={!(imageError === '' && hasSelected)}
              color="primary"
              variant="contained"
              className="inline-block"
            >
              Save
            </Button>
          </div>
        </Typography>
      </div>
    </PageSection>
  );
}

export default AvatarSettings;
