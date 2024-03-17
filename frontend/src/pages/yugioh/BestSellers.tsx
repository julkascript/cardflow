import { Stack, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import PageSection from '../../components/PageSection';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import { useEffect, useState } from 'react';
import { bestSellerService } from '../../services/bestSeller/bestSeller';
import { BestSeller } from '../../services/bestSeller/types';
import Logo from '../../components/logo/Logo';
import { theme } from '../../constants/theme';
import { Link } from 'react-router-dom';

export default function BestSellers() {
  const [cards, setCards] = useState<BestSeller[]>([]);
  const cardSection = cards.map((card) => {
    return (
      <div className="mt-4 flex flex-col justify-items-center align-items-center" key={card.id}>
        <Link to={`/details/yugioh/${card.id}`}>
          <img
            src={card.card_image}
            className="w-[300px] lg:w-[182px] shadow-xl"
            alt="card image"
          />
          <Typography
            variant="h6"
            display="flex"
            justifyContent="center"
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
            $ {card.lowest_price}
          </Typography>
        </Stack>
      </div>
    );
  });

  useEffect(() => {
    // console.log(123, theme.palette.info);
    bestSellerService.getBestSellers().then((bestSellers) => {
      setCards(bestSellers);
    });
  }, []);

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <ListingTopBar />
      <PageHeader heading="Buy" />
      <div className="w-5/6 mx-auto my-4">
        <PageSection className="p-8 my-4">
          <Typography variant="h4">All-time best sellers</Typography>
          <hr />
          <section className="flex flex-row gap-4 mt-6">{cardSection}</section>
        </PageSection>
      </div>
    </section>
  );
}
