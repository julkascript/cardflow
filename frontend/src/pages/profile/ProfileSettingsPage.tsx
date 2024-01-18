import { useState } from 'react';
import ProfilePage from '../../components/profile/ProfilePage';
import AvatarSettings from '../../components/profile/profileSettings/avatarSettings/AvatarSettings';
import DeleteAccount from '../../components/profile/profileSettings/DeleteAccount';
import EmailSettings from '../../components/profile/profileSettings/EmailSettings';
import ShipmentAddressSettings from '../../components/profile/profileSettings/ShipmentAddressSettings';
import UsernameSettings from '../../components/profile/profileSettings/usernameSettings/UsernameSettings';
import { useCurrentUser } from '../../context/user';
import { UserAccount } from '../../services/user/types';
import { userService } from '../../services/user/user';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import { useLogout } from '../../util/useLogout';

function ProfileSettingsPage(): JSX.Element {
  const { user } = useCurrentUser();
  const logout = useLogout();
  const [userData, setUserData] = useState<UserAccount>({
    username: '',
    password: '',
    email: '',
    first_name: null,
    last_name: null,
    phone_number: null,
    city: null,
    shipping_address: null,
    avatar: null,
  });

  function updateAccount(section: keyof UserAccount, data: string) {
    const payload: Partial<UserAccount> = { [section]: data };
    return userService.updateUser(user.user_id, payload).then(setUserData);
  }

  function updateAndLogout(field: 'username' | 'email', value: string) {
    updateAccount(field, value).then(logout);
  }

  useEffectAfterInitialLoad(() => {
    userService.getUser(user.user_id).then(setUserData);
  }, []);

  return (
    <ProfilePage className="bg-[#F5F5F5]">
      <div className="flex flex-col gap-8">
        <AvatarSettings avatar={userData?.avatar?.toString() || ''} />
        <UsernameSettings
          onSubmit={(u) => updateAndLogout('username', u)}
          key={user.username + '1'}
          username={user.username}
        />
        <EmailSettings
          onSubmit={(e) => updateAndLogout('email', e)}
          key={user.email + '2'}
          email={user.email}
        />
        <ShipmentAddressSettings />
        <DeleteAccount />
      </div>
    </ProfilePage>
  );
}

export default ProfileSettingsPage;
