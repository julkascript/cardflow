import ProfilePage from '../../components/profile/ProfilePage';
import AvatarSettings from '../../components/profile/profileSettings/avatarSettings/AvatarSettings';
import DeleteAccount from '../../components/profile/profileSettings/DeleteAccount';
import EmailSettings from '../../components/profile/profileSettings/EmailSettings';
import ShipmentAddressSettings from '../../components/profile/profileSettings/ShipmentAddressSettings';
import UsernameSettings from '../../components/profile/profileSettings/usernameSettings/UsernameSettings';
import { useCurrentUser } from '../../context/user';
import { UserAccount } from '../../services/user/types';
import { userService } from '../../services/user/user';
import { useLogout } from '../../util/useLogout';

function ProfileSettingsPage(): JSX.Element {
  const { user, setUser } = useCurrentUser();
  const logout = useLogout();

  async function updateAccount(section: keyof UserAccount, data: string) {
    const payload: Partial<UserAccount> = { [section]: data };
    return userService.updateUser(user.user_id, payload).then((data) => {
      setUser({ user_id: user.user_id, ...data });
    });
  }

  function updateAndLogout(field: 'username' | 'email', value: string) {
    updateAccount(field, value).then(logout);
  }

  function deleteAccount() {
    userService.deleteUser(user.user_id).then(logout);
  }

  function updateAvatar(avatar: File) {
    userService.updateUserAvatar(user.user_id, avatar);
  }

  return (
    <ProfilePage className="bg-[#F5F5F5]">
      <div className="flex flex-col gap-8">
        <AvatarSettings key={user?.avatar + '0'} avatar={user.avatar} onSubmit={updateAvatar} />
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
        <ShipmentAddressSettings
          address={user.shipping_address}
          onSubmit={(a) => updateAccount('shipping_address', a)}
          key={user.shipping_address + '3'}
        />
        <DeleteAccount onDelete={deleteAccount} />
      </div>
    </ProfilePage>
  );
}

export default ProfileSettingsPage;
