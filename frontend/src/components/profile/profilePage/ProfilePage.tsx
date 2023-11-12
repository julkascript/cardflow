import PageHeader from '../../pageHeader/PageHeader';
import ProfileNavigation from '../ProfileNavigation';

type ProfileSectionProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * A wrapper for profile pages with some preconfigured styling.
 * Includes the profile navigation and the content you pass.
 * @param props
 * @returns
 */
function ProfilePage(props: ProfileSectionProps): JSX.Element {
  const className = props.className || '';

  return (
    <section className={className}>
      <PageHeader heading="Account"></PageHeader>
      <div className="block text-center p-8 lg:text-left lg:grid lg:grid-cols-[1fr_3fr] lg:p-24">
        <ProfileNavigation />
        {props.children}
      </div>
    </section>
  );
}

export default ProfilePage;
