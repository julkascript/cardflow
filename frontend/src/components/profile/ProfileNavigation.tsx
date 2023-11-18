import { NavLink, useParams } from 'react-router-dom';

type ProfileLinks = {
  href: string;
  text: string;
};

function ProfileNavigation(): JSX.Element {
  function isActive({ isActive }: { isActive: boolean }) {
    return isActive ? 'font-bold hover:underline' : 'hover:underline';
  }

  const params = useParams();
  const username = params.username || '';

  const links: ProfileLinks[] = [
    /*
      TO-DOs:
        - hide account details link from other users
    */
    {
      href: `/user/${username}/settings`,
      text: 'Account details',
    },
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
