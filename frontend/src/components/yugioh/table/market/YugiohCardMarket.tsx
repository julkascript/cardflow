import { YugiohCardListing } from '../../../../services/yugioh/types';
import MarketTable from '../../../marketTable/MarketTable';
import YugiohCardMarketTableCell from './YugiohCardMarketTableCell';

type YugiohCardMarketProps = {
  listings: YugiohCardListing[];
  rarity: string;
  set_code: string;
};

function YugiohCardMarket(props: YugiohCardMarketProps): JSX.Element {
  return (
    <>
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
            {props.listings.map((l) => (
              <YugiohCardMarketTableCell
                set_code={props.set_code}
                key={l.id}
                rarity={props.rarity}
                listing={l}
              />
            ))}
          </tbody>
        </MarketTable>
      </div>
    </>
  );
}

export default YugiohCardMarket;
