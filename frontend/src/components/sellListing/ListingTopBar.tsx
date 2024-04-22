import { Tab, Tabs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const tabValues = Object.entries({
  '/buy': 'buy',
  '/search': 'buy',
  '/sell': 'sell',
  '/about': 'about',
});

function CardflowTabs() {
  const location = useLocation();
  const currentPath = location.pathname;

  function computeValue() {
    const pathValue = tabValues.find((tv) => currentPath.includes(tv[0]));
    return pathValue ? pathValue[1] : 'buy';
  }

  return (
    <Tabs className="bg-white pl-4" value={computeValue()}>
      <Tab value="buy" component={Link} to="/buy" label="Buy" />
      <Tab value="sell" component={Link} to="/sell/manage" label="Sell" />
      <Tab value="trade" component={Link} to="#" label="Trade" />
      <Tab value="about" component={Link} to="/about" label="About" />
    </Tabs>
  );
}

export default CardflowTabs;
