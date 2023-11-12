import ProfileNavigation from '../../components/profile/ProfileNavigation';
import ProfilePublicData from '../../components/profile/ProfilePublicData';
import ProfileMarketActivity from '../../components/profile/profileMarketActivity/ProfileMarketActivity';
function ProfilePublicInfoPage(): JSX.Element {
  return (
    <section>
      <header>
        <h1>Account</h1>
      </header>
      <div className="grid grid-cols-[1fr_3fr] p-4 md:p-24">
        <ProfileNavigation />
        <div className="flex flex-col gap-2">
          <ProfilePublicData />
          <ProfileMarketActivity />
        </div>
      </div>
    </section>
  );
}

export default ProfilePublicInfoPage;
