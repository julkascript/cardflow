import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import ProfilePagePlaceholder from '../pages/profile/ProfilePagePlaceholder';
import ProfilePublicInfoPage from '../pages/profile/ProfilePublicInfoPage';
import ProfileSettingsPage from '../pages/profile/ProfileSettingsPage';
import Home from '../pages/Home';
import { authorizedGuard } from './authorizedGuard/authorizedGuard';
import YugiohCardDetails from '../pages/yugioh/YugiohCardDetails';
import { loadCardDetails } from './loadCardDetails/loadCardDetails';
import Search from '../pages/Search';
import { loadSearchResults } from './loadSearchResults/loadSearchResults';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/protected',
        element: <h1>Protected route</h1>,
        loader: authorizedGuard,
      },
      {
        path: '/search',
        element: <Search />,
        loader: loadSearchResults,
      },
      {
        path: '/search/:query',
        element: <Search />,
        loader: loadSearchResults,
      },
      {
        path: '/user/:username',
        children: [
          {
            path: '',
            element: <ProfilePublicInfoPage />,
          },
          {
            path: 'settings',
            element: <ProfileSettingsPage />,
          },
          {
            path: 'blog',
            element: <ProfilePagePlaceholder />,
          },
        ],
      },
      {
        path: 'details',
        children: [
          {
            path: 'yugioh',
            children: [
              {
                path: ':id',
                loader: loadCardDetails,
                element: <YugiohCardDetails />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function Router(): JSX.Element {
  return <RouterProvider router={routes} />;
}

export default Router;
