import PageHeader from '../../components/PageHeader';
import YugiohCardImage from '../../components/yugioh/YugiohCardImage';
import YugiohCardDetailsTable from '../../components/yugioh/table/YugiohCardDetailsTable';
import YugiohCardMarket from '../../components/yugioh/table/market/YugiohCardMarket';

function YugiohCardDetails(): JSX.Element {
  return (
    <section className="bg-[#F5F5F5]">
      <PageHeader heading="Buy / Search / Dark Magician"></PageHeader>
      <div className="flex flex-col pt-4 pb-4 lg:flex-row justify-center items-center lg:items-start gap-8">
        <YugiohCardImage />
        <YugiohCardDetailsTable />
      </div>
      <YugiohCardMarket />
    </section>
  );
}

export default YugiohCardDetails;
