import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../context/user';

export const useLogout = () => {
  const navigate = useNavigate();
  const { restartUser } = useCurrentUser();

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    restartUser();
    navigate('/');
  }

  return logout;
};
