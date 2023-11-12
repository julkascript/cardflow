import ProfilePublicData from '../../components/profile/ProfilePublicData';
import ProfileMarketActivity from '../../components/profile/profileMarketActivity/ProfileMarketActivity';
import ProfilePage from '../../components/profile/profilePage/ProfilePage';

function ProfilePublicInfoPage(): JSX.Element {
  return (
    <ProfilePage>
      <div className="flex flex-col gap-2">
        <ProfilePublicData />
        <ProfileMarketActivity />
      </div>
    </ProfilePage>
  );
}

export default ProfilePublicInfoPage;
