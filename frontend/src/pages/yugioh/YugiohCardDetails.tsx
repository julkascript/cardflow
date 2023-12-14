import { useLoaderData } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import YugiohCardImage from '../../components/yugioh/YugiohCardImage';
import YugiohCardDetailsTable from '../../components/yugioh/table/YugiohCardDetailsTable';
import YugiohCardMarket from '../../components/yugioh/table/market/YugiohCardMarket';
import { CardDetailsLoaderData } from '../../services/yugioh/types';

function YugiohCardDetails(): JSX.Element {
  const data = useLoaderData() as CardDetailsLoaderData;
  const { cardInSet } = data;

  return (
    <section className="bg-[#F5F5F5]">
      <PageHeader heading={`Buy / Search / ${cardInSet.yugioh_card.card_name}`}></PageHeader>
      <div className="flex flex-col pt-4 pb-4 lg:flex-row justify-center items-center lg:items-start gap-8">
        <YugiohCardImage src={cardInSet.yugioh_card.image} />
        <YugiohCardDetailsTable cardInSet={cardInSet} />
      </div>
      <YugiohCardMarket />
    </section>
  );
}

export default YugiohCardDetails;
