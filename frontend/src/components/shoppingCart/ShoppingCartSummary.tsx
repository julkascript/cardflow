import { Delete, Home, Info } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Pagination,
  TextField,
  Tooltip,
} from '@mui/material';
import SummaryData from './SummaryData';
import MarketTable from '../marketTable/MarketTable';
import PageSection from '../PageSection';
import { CurrentUser } from '../../services/user/types';
import YugiohCardQuantityField from '../yugioh/table/market/YugiohCardQuantityField';
import { ShoppingCartItem } from '../../services/shoppingCart/types';

type ShoppingCartSummaryProps = {
  user: CurrentUser;
  shoppingCart: ShoppingCartItem[];
  shipmentCost: number;
  shipmentAddress: string;
  onShipmentAddressChange: (shipmentAddress: string) => void;
  onRemoveAll: () => void;
  onRemove: (id: number) => void;
  onChangeQuantity: (id: number, quantity: number) => void;
  page: number;
  pages: number;
  onChangePage: (page: number) => void;
  totalPrice: number;
};

function ShoppingCartSummary(props: ShoppingCartSummaryProps): JSX.Element {
  const shipmentAddressIsValid = props.shipmentAddress !== '';

  const shipmentAddressTooltipText = props.shipmentAddress
    ? 'Your details were pre-filled from your profile.'
    : 'You can set a default shipment address from your profile, which will be pre-filled for future purchases.';
  return (
    <PageSection className="p-8 pt-4 w-11/12 lg:w-1/2 relative">
      <section className="flex items-end justify-end absolute right-4 top-2">
        <Tooltip title="Empty out the shopping cart (remove all listings)">
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              props.onRemoveAll();
            }}
          >
            <Delete color="error" />
          </IconButton>
        </Tooltip>
      </section>
      <div className="flex flex-wrap flex-col items-center lg:items-start text-center lg:text-left lg:flex-row gap-4 pt-4 pb-4">
        <section className="w-2/5">
          <h3 className="font-bold mb-4">Summary</h3>
          <ul className="mr-4">
            <SummaryData summary="Card(s) total price" data={props.totalPrice} />
            <SummaryData summary="Shipment price" data={props.shipmentCost} />
            <SummaryData boldedData summary="Total" data={props.totalPrice + props.shipmentCost} />
          </ul>
        </section>
        <Divider className="none lg:block" orientation="vertical" flexItem />
        <Divider className="block lg:none" flexItem />
        <section>
          <h3 className="font-bold mb-2">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span>Shipping details</span>
              <Tooltip title={shipmentAddressTooltipText} placement="top">
                <IconButton>
                  <Info />
                </IconButton>
              </Tooltip>
            </div>
          </h3>
          <TextField
            error={!shipmentAddressIsValid}
            helperText={shipmentAddressIsValid ? '' : 'Please enter a valid address!'}
            value={props.shipmentAddress}
            onChange={(e) => {
              e.preventDefault();
              props.onShipmentAddressChange(e.target.value);
            }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home />
                </InputAdornment>
              ),
            }}
            disabled={props.shoppingCart.length === 0}
            className="w-full"
          />
        </section>
      </div>
      <section className="flex mt-4 lg:justify-center w-full overflow-auto">
        <MarketTable className="text-center w-full">
          <thead>
            <tr>
              <th colSpan={3}>Card Details</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Quantity</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Price</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.shoppingCart.map((shoppingCartItem) => (
              <tr key={shoppingCartItem.listing.id}>
                <td className="font-bold">
                  <Link
                    underline="hover"
                    href={`/details/yugioh/${shoppingCartItem.listing.card_set_id}`}
                  >
                    {shoppingCartItem.listing.card_name}
                  </Link>
                </td>
                <td>{shoppingCartItem.listing.card_in_set.set.set_code}</td>
                <td>{shoppingCartItem.listing.card_in_set.rarity.rarity}</td>
                <td>
                  <YugiohCardQuantityField
                    hidden={false}
                    onChange={(quantity) =>
                      props.onChangeQuantity(shoppingCartItem.listing.id, quantity)
                    }
                    quantity={shoppingCartItem.quantity}
                    max={shoppingCartItem.listing.quantity}
                  />
                </td>
                <td className="font-bold">$&nbsp;{shoppingCartItem.listing.price.toFixed(2)}</td>
                <td>
                  <Tooltip title="Remove this listing">
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        props.onRemove(shoppingCartItem.id);
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </MarketTable>
      </section>
      <section className="flex justify-center">
        <Pagination
          page={props.page}
          count={props.pages}
          onChange={(e, p) => {
            e.preventDefault();
            props.onChangePage(p);
          }}
        />
      </section>
    </PageSection>
  );
}

export default ShoppingCartSummary;
