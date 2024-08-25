import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const tabValues = Object.entries({
  '/buy': 'buy',
  '/search': 'buy',
  '/sell': 'sell',
  '/about': 'about',
  '/trade': 'trade',
});

function CardflowTabs() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { t } = useTranslation('common');

  function computeValue() {
    const pathValue = tabValues.find((tv) => currentPath.includes(tv[0]));
    return pathValue ? pathValue[1] : 'buy';
  }

  return (
    <Tabs className="bg-white pl-2 border-b-2" value={computeValue()}>
      <Tab value="buy" component={Link} to="/buy" label={t('tabs.buy')} />
      <Tab value="sell" component={Link} to="/sell/manage" label={t('tabs.sell')} />
      <Tab value="trade" component={Link} to="/trade" label={t('tabs.trade')} />
      <Tab value="about" component={Link} to="/about" label={t('tabs.about')} />
    </Tabs>
  );
}

export default CardflowTabs;
