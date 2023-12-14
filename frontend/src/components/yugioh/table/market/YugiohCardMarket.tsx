import MarketTable from '../../../marketTable/MarketTable';
import YugiohCardMarketTableCell from './YugiohCardMarketTableCell';

function YugiohCardMarket(): JSX.Element {
  return (
    <div className="flex flex-col md:items-center justify-center overflow-auto">
      <MarketTable className="w-11/12 md:w-full lg:w-5/6 mb-12">
        <thead>
          <tr>
            <th colSpan={3}>Seller</th>
            <th colSpan={2}>Card details</th>
            <th>Available</th>
            <th colSpan={3}>Buy</th>
          </tr>
        </thead>
        <tbody>
          <YugiohCardMarketTableCell />
          <YugiohCardMarketTableCell />
          <YugiohCardMarketTableCell />
          <YugiohCardMarketTableCell />
        </tbody>
      </MarketTable>
    </div>
  );
}

export default YugiohCardMarket;
