import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import ProfilePagePlaceholder from '../pages/profile/ProfilePagePlaceholder';
import ProfilePublicInfoPage from '../pages/profile/ProfilePublicInfoPage';
import ProfileSettingsPage from '../pages/profile/ProfileSettingsPage';
import Home from '../pages/Home';
import { authorizedGuard } from './authorizedGuard/authorizedGuard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import YugiohCardDetails from '../pages/yugioh/YugiohCardDetails';
import { loadCardDetails } from './loadCardDetails/loadCardDetails';
import Search from '../pages/Search';
import { loadSearchResults } from './loadSearchResults/loadSearchResults';
import SellManagement from '../pages/yugioh/SellManagement';
import Newlisting from '../pages/listing/NewListing';
import SellListing from '../pages/listing/SellListing';
import EditListing from '../pages/listing/EditListing';
import { loadListingDetails } from './loadListingDetails/loadEditListingDetails';
import { loadPublicUserInfo } from './loadPublicUserInfo/loadPublicUserInfo';
import Cart from '../pages/Cart';
import Changelog from '../pages/about/Changelog';
import About from '../pages/about/About';
import FAQ from '../pages/about/FAQ';
import Contact from '../pages/about/Contact';
import BestSellers from '../pages/yugioh/BestSellers';

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
        path: '/yugioh',
        index: true,
        element: <BestSellers />,
      },
      {
        path: '/login',
        index: true,
        element: <Login />,
      },
      {
        path: '/register',
        index: true,
        element: <Register />,
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
        path: '/cart',
        element: <Cart />,
        loader: authorizedGuard,
      },
      {
        path: '/about',
        children: [
          {
            path: '',
            element: <About />,
          },
          {
            path: 'faq',
            element: <FAQ />,
          },
          {
            path: 'contact',
            element: <Contact />,
          },
          {
            path: 'changelog',
            element: <Changelog />,
          },
        ],
      },
      {
        path: '/user/:username',
        children: [
          {
            path: '',
            element: <ProfilePublicInfoPage />,
            loader: loadPublicUserInfo,
          },
          {
            path: 'settings',
            element: <ProfileSettingsPage />,
            loader: authorizedGuard,
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
      {
        path: 'buy',
        children: [
          {
            path: '',
            element: <BestSellers />,
          },
        ],
      },
      {
        path: 'sell',
        children: [
          {
            path: 'manage',
            element: <SellManagement />,
            loader: authorizedGuard,
          },
          {
            path: 'new',
            element: <Newlisting />,
          },
          {
            path: 'new/:id',
            loader: loadCardDetails,
            element: <SellListing />,
          },
          {
            path: 'listing/:id/edit',
            loader: loadListingDetails,
            element: <EditListing />,
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
