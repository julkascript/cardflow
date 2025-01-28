import { Delete, Home, Info } from '@mui/icons-material';
import { Divider, IconButton, InputAdornment, Link, TextField, Tooltip } from '@mui/material';
import SummaryData from './SummaryData';
import MarketTable from '../marketTable/MarketTable';
import PageSection from '../PageSection';
import { CurrentUser } from '../../services/user/types';
import YugiohCardQuantityField from '../yugioh/table/market/YugiohCardQuantityField';
import { ShoppingCartItem } from '../../services/shoppingCart/types';
import Person from '@mui/icons-material/Person';
import Phone from '@mui/icons-material/Phone';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../context/user';

type ShoppingCartSummaryProps = {
  user: CurrentUser;
  shoppingCart: ShoppingCartItem[];
  shipmentCost: number;
  shipmentAddress: string;
  names: string;
  phoneNumber: string;
  onShipmentAddressChange: (shipmentAddress: string) => void;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onNamesChange: (names: string) => void;
  onRemoveAll: () => void;
  onRemove: (id: number) => void;
  onChangeQuantity: (id: number, quantity: number) => void;
  page: number;
  count: number;
  onChangePage: (page: number) => void;
  totalPrice: number;
};

function ShoppingCartSummary(props: ShoppingCartSummaryProps): JSX.Element {
  const shipmentAddressIsValid = props.shipmentAddress !== '';
  const phoneNumberIsValid = props.phoneNumber !== '';
  const namesIsValid = props.names !== '';
  const { t } = useTranslation('buy');
  const { t: commonT } = useTranslation('common');

  const { user } = useCurrentUser();

  const shipmentAddressTooltipText = t('cart.summary.shipment.shipmentAddressPrefilled', {
    context: (props.shipmentAddress !== '').toString(),
  });
  return (
    <PageSection className="p-8 pt-4 w-11/12 lg:w-1/2 relative">
      <section className="flex items-end justify-end absolute right-4 top-2">
        <Tooltip title={t('cart.emptyAllButtonTooltipText')}>
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
          <h3 className="font-bold mb-4">{commonT('purchaseDetails.summary')}</h3>
          <ul className="mr-4">
            <SummaryData
              summary={commonT('purchaseDetails.cardsTotalPrice', {
                count: props.shoppingCart.reduce((total, item) => total + item.quantity, 0),
              })}
              data={props.totalPrice}
            />
            {/* <SummaryData
              summary={commonT('purchaseDetails.shipmentPrice')}
              data={props.shipmentCost}
            /> */}
            <SummaryData
              boldedData
              summary={commonT('purchaseDetails.totalPrice')}
              data={props.totalPrice + props.shipmentCost}
            />
          </ul>
        </section>
        <Divider className="hidden lg:block" orientation="vertical" flexItem />
        <Divider className="block lg:hidden" flexItem />
        <section className="flex gap-2 flex-col">
          <h3 className="font-bold mb-2">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span>{commonT('purchaseDetails.shippingDetails.title')}</span>
              <Tooltip title={shipmentAddressTooltipText} placement="top">
                <IconButton>
                  <Info />
                </IconButton>
              </Tooltip>
            </div>
          </h3>
          <TextField
            error={!shipmentAddressIsValid}
            helperText={
              shipmentAddressIsValid ? '' : t('cart.summary.shipment.invalidShipmentAddress')
            }
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
          <TextField
            error={!namesIsValid}
            helperText={namesIsValid ? '' : t('cart.summary.shipment.invalidNames')}
            value={props.names}
            onChange={(e) => {
              e.preventDefault();
              props.onNamesChange(e.target.value);
            }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            disabled={props.shoppingCart.length === 0}
            className="w-full"
          />
          <TextField
            error={!phoneNumberIsValid}
            helperText={phoneNumberIsValid ? '' : t('cart.summary.shipment.invalidPhoneNumber')}
            value={props.phoneNumber}
            onChange={(e) => {
              e.preventDefault();
              props.onPhoneNumberChange(e.target.value);
            }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
            disabled={props.shoppingCart.length === 0}
            className="w-full"
          />
        </section>
      </div>
      <section className="flex mt-4 lg:justify-center w-full overflow-auto">
        <MarketTable
          page={props.page}
          onPageChange={props.onChangePage}
          count={props.count}
          className="text-center w-full"
        >
          <thead>
            <tr>
              <th colSpan={3}>{commonT('purchaseDetails.table.tableHeaders.cardDetails')}</th>
              <th style={{ textAlign: 'center', padding: 8 }}>
                {commonT('purchaseDetails.table.tableHeaders.quantity')}
              </th>
              <th style={{ textAlign: 'center', padding: 8 }}>
                {commonT('purchaseDetails.table.tableHeaders.price')}
              </th>
              <th style={{ textAlign: 'center', padding: 8 }}>
                {t('cart.summary.table.tableHeaders.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.shoppingCart.map((shoppingCartItem) => (
              <tr key={shoppingCartItem.listing.id}>
                <td className="font-bold">
                  <Link
                    underline="hover"
                    href={`/details/yugioh/${shoppingCartItem.listing.card_in_set.id}`}
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
                <td className="font-bold">
                  {shoppingCartItem.listing.price} {user.currency_preference}
                </td>
                <td>
                  <Tooltip title={t('cart.summary.table.tableBody.removeListingTooltipText')}>
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
    </PageSection>
  );
}

export default ShoppingCartSummary;
