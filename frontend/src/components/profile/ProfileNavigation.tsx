import { NavLink, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../context/user';

type ProfileLinks = {
  href: string;
  text: string;
};

function ProfileNavigation(): JSX.Element {
  function isActive({ isActive }: { isActive: boolean }) {
    return isActive ? 'font-bold hover:underline' : 'hover:underline';
  }

  function AccountDetailsLink(username: string, currentUsername: string): JSX.Element {
    if (username.toLowerCase() !== currentUsername.toLowerCase()) {
      return <></>;
    }

    return (
      <li className="mb-2">
        <NavLink end to={`/user/${username}/settings`} className={isActive}>
          Account details
        </NavLink>
      </li>
    );
  }

  const params = useParams();
  const username = params.username || '';
  const { user } = useCurrentUser();
  const DetailsLink = () => AccountDetailsLink(username, user.username);

  const links: ProfileLinks[] = [
    {
      href: `/user/${username}`,
      text: 'Public info',
    },
    {
      href: `/user/${username}/blog`,
      text: 'Blog',
    },
  ];

  return (
    <ul className="mb-4 lg:m-0">
      <DetailsLink />
      {links.map((l) => (
        <li key={l.href} className="mb-2">
          <NavLink end to={l.href} className={isActive}>
            {l.text}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default ProfileNavigation;
