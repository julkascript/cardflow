import { useLoaderData, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import YugiohCardImage from '../../components/yugioh/YugiohCardImage';
import YugiohCardDetailsTable from '../../components/yugioh/table/YugiohCardDetailsTable';
import YugiohCardMarket from '../../components/yugioh/table/market/YugiohCardMarket';
import { CardDetailsLoaderData } from '../../services/yugioh/types';
import { useState } from 'react';
import { Pagination } from '@mui/material';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';

function YugiohCardDetails(): JSX.Element {
  const data = useLoaderData() as CardDetailsLoaderData;
  const params = useParams();
  const { cardInSet, cardListings: cardListingsData } = data;
  const [cardListings, setCardListings] = useState(cardListingsData);
  const pages = Math.ceil(cardListings.count / 10);

  const [page, setPage] = useState(1);

  function changePage(_event: React.ChangeEvent<unknown>, page: number) {
    yugiohService
      .getCardListingsByCardSetId(Number(params.id), page)
      .then((data) => {
        setCardListings(data);
        setPage(page);
      })
      .catch(() => {}); // TO-DO: implement feedback for failed requests.
  }

  useEffectAfterInitialLoad(() => {
    yugiohService.getCardListingsByCardSetId(Number(params.id)).then(setCardListings).catch();
    setPage(1);
  }, [params.id]);

  return (
    <section className="bg-[#F5F5F5]">
      <PageHeader heading={`Buy / Search / ${cardInSet.yugioh_card.card_name}`}></PageHeader>
      <div className="flex flex-col pt-4 pb-4 lg:flex-row justify-center items-center lg:items-start gap-8">
        <YugiohCardImage src={cardInSet.yugioh_card.image} />
        <YugiohCardDetailsTable cardInSet={cardInSet} />
      </div>
      <YugiohCardMarket listings={cardListings.results} />
      <Pagination
        page={page}
        className="flex justify-center pb-8"
        count={pages}
        onChange={changePage}
      />
    </section>
  );
}

export default YugiohCardDetails;
