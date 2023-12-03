import { useAuthenticationStatus } from '../context/user';

/**
 * Renders the passed components only if the current user is  NOT authenticated
 */
function Unauthorized({ children }: { children: React.ReactNode }): JSX.Element | null {
  const { isAuthenticated } = useAuthenticationStatus();

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default Unauthorized;
