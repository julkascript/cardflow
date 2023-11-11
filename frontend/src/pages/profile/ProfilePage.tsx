import ProfileNavigation from '../../components/profile/ProfileNavigation';

function ProfilePage(): JSX.Element {
  return (
    <section>
      <header>
        <h1>Account</h1>
      </header>
      <div>
        <ProfileNavigation />
      </div>
    </section>
  );
}

export default ProfilePage;
