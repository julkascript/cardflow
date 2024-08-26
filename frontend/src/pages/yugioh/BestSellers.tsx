import { Stack, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import PageSection from '../../components/PageSection';
import CardflowTabs from '../../components/cardflowTabs/CardflowTabs';
import { useEffect, useState } from 'react';
import { bestSellerService } from '../../services/bestSeller/bestSeller';
import { BestSeller } from '../../services/bestSeller/types';
import Logo from '../../components/logo/Logo';
import { theme } from '../../constants/theme';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../util/useCurrency';

export default function BestSellers() {
  const [cards, setCards] = useState<BestSeller[]>([]);
  const { t } = useTranslation('buy');
  const cardSection = cards.map((card) => {
    return (
      <div
        className="mt-4 flex flex-col justify-items-center align-items-center"
        key={card.card_id}
      >
        <Link to={`/details/yugioh/${card.card_id}`}>
          <img
            src={card.card_image}
            className="mx-auto w-[300px] lg:w-[182px] shadow-xl"
            alt="card image"
          />
          <Typography
            variant="h6"
            display="flex"
            justifyContent="center"
            textAlign="center"
            fontWeight="bolder"
            marginTop={3}
            color={theme.palette.info.secondary}
          >
            {card.card_name}
          </Typography>
        </Link>
        <Stack direction="row" justifyContent="center" alignItems="center" marginTop={0.5}>
          <Typography variant="body1" marginRight={1} fontWeight="bold">
            {card.set_code}
          </Typography>
          <Logo color="black" size={16} textColor="black" />
          <Typography variant="body1" fontWeight="bold" marginLeft={1}>
            {useCurrency(card.lowest_price)}
          </Typography>
        </Stack>
      </div>
    );
  });

  useEffect(() => {
    bestSellerService.getBestSellers().then((bestSellers) => {
      setCards(bestSellers);
    });
  }, []);

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <CardflowTabs />
      <PageHeader heading="Buy" />
      <div className="w-5/6 mx-auto my-4">
        <PageSection className="p-8 my-4">
          <Typography variant="h4" className="text-center lg:text-left">
            {t('bestSellers.title')}
          </Typography>
          <hr />
          <section className="max-sm:flex-col gap-4 mt-6 flex justify-between">
            {cardSection}
          </section>
        </PageSection>
      </div>
    </section>
  );
}
