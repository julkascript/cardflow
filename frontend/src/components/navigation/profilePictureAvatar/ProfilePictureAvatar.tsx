import { Avatar, Link } from '@mui/material';
import { useCurrentUser } from '../../../context/user';

type ProfilePictureAvatar = {
  imageUrl?: string;
};

/**
 * An avatar image which links to the user's profile
 * @param props
 * @returns
 */
function ProfilePictureAvatar(props: ProfilePictureAvatar): JSX.Element {
  const { user } = useCurrentUser();

  return (
    <Link href={`/user/${user.username}/settings`}>
      <Avatar src={props.imageUrl} />
    </Link>
  );
}

export default ProfilePictureAvatar;
