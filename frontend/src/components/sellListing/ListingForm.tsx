import {
  SelectChangeEvent,
  TextField,
  Select,
  MenuItem,
  Chip,
  Divider,
  Link,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  YugiohCardListing,
  condition,
  YugiohCardSellListing,
  PaginatedItem,
  YugiohCardInSet,
} from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';
import CardflowTabs from '../cardflowTabs/CardflowTabs';
import NewListingTopBar from './NewListingTopBar';
import PaymentsIcon from '@mui/icons-material/Payments';
import DiamondIcon from '@mui/icons-material/Diamond';
import TagIcon from '@mui/icons-material/Tag';
import PageSection from '../PageSection';
import MarketTable from '../marketTable/MarketTable';
import YugiohSellerRankLabel from '../yugioh/seller/YugiohSellerRankLabel';
import YugiohSellerRankBadge from '../yugioh/seller/YugiohSellerRankBadge';
import YugiohCardConditionLabel from '../yugioh/YugiohCardConditionLabel';
import DeleteListingButton from './buttons/DeleteListingButton';
import ClearListingButton from './buttons/ClearListingButton';
import ToggleVisibilityButton from './buttons/ToggleVisibilityButton';
import { useToast } from '../../util/useToast';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../context/user';
import { currencies } from '../../constants/currencies';

type ListingFormProps = {
  editMode?: boolean;
  onSubmit: (data: YugiohCardSellListing, postAnother: boolean) => void;
  listing?: YugiohCardListing;
  listings: PaginatedItem<YugiohCardListing>;
  cardInSet: YugiohCardInSet;
  title: string;
};

function ListingForm(props: ListingFormProps) {
  const [page, setPage] = useState(1);
  const params = useParams();
  const id = Number(params.id);
  const [cardListings, setCardListings] = useState(props.listings);
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('sell');
  const { t: commonT } = useTranslation('common');
  const { user } = useCurrentUser();

  const [formData, setFormData] = useState<YugiohCardListing>(
    props.listing || {
      id: 0,
      quantity: 0,
      condition: 'poor',
      price: 0,
      is_sold: true,
      is_listed: true,
      card: 0,
      user_name: '',
      user: 0,
      card_name: '',
      card_set_id: 0,
      card_in_set: {
        id: 0,
        yugioh_card: {
          id: 0,
          card_name: '',
          type: '',
          frame_type: '',
          description: '',
          attack: '',
          defense: '',
          level: '',
          race: '',
          attribute: '',
          archetype: '',
          image: '',
        },
        set: {
          id: 0,
          card_set_name: '',
          set_code: '',
        },
        rarity: {
          id: 0,
          rarity: '',
          rarity_code: '',
        },
      },
      is_trade_considered: false,
    },
  );

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const quantity = Number(value);

    if (quantity > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        quantity,
      }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const price = Number(value);

    // Allow zero so users can input prices like $0.99 without issues
    if (price >= 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        price,
      }));
    }
  };

  const handleTradeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prevFormData) => ({ ...prevFormData, is_trade_considered: checked }));
  };

  const handleConditionChange = (e: SelectChangeEvent<condition>) => {
    const condition = e.target.value as condition;
    if (condition) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        condition,
      }));
    }
  };

  async function deleteListing() {
    try {
      await yugiohService.deleteListingById(Number(params.id));
      navigate('/sell/manage');
    } catch (error) {
      toast.error({ error });
    }
  }

  function changeVisibility() {
    yugiohService
      .editListing({ ...formData, is_listed: !formData.is_listed })
      .then(() => setFormData((state) => ({ ...state, is_listed: !state.is_listed })))
      .catch((error) => toast.error({ error }));
  }

  async function handleSubmit(e: React.FormEvent, postAnother: boolean): Promise<void> {
    e.preventDefault();

    const newData: YugiohCardSellListing = {
      quantity: formData.quantity,
      condition: formData.condition,
      price: formData.price,
      is_sold: false,
      is_listed: formData.is_listed,
      card: props.cardInSet.id,
      is_trade_considered: formData.is_trade_considered,
    };

    props.onSubmit(newData, postAnother);
  }

  function changePage(page: number) {
    yugiohService
      .getCardListingsByCardSetId(props.cardInSet.id, page)
      .then((data) => {
        setCardListings(data);
        setPage(page);
      })
      .catch((error) => toast.error({ error }));
  }
  return (
    <section className="bg-[#F5F5F5] pb-4">
      <CardflowTabs />
      <NewListingTopBar
        handleSubmit={handleSubmit}
        quantity={formData.quantity}
        price={formData.price}
        title={props.title}
      />
      <PageSection className="w-11/12 mt-4 md:w-5/6 mx-auto p-4 md:p-8 flex flex-col gap-8">
        <div className="flex justify-between gap-4 md:gap-0">
          <section className="flex gap-4 md:gap-8">
            <img src={props.cardInSet.yugioh_card.image} className="w-1/2 lg:w-1/4" />
            <div>
              <h3 className="text-xl md:text-2xl lg:text-4xl font-medium">
                {props.cardInSet.yugioh_card.card_name}
              </h3>
              <div className="hidden lg:flex gap-4">
                <Chip
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label={props.cardInSet.set.set_code}
                />
                <Chip
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label={props.cardInSet.rarity.rarity}
                />
              </div>
              <div className="flex lg:hidden gap-2">
                <Chip
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label={props.cardInSet.set.set_code}
                />
                <Chip
                  color="secondary"
                  size="small"
                  variant="outlined"
                  label={props.cardInSet.rarity.rarity}
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                <div className="flex flex-col mt-10 lg:mt-20 gap-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <TextField
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleQuantityChange}
                      placeholder={t('newListing.secondSection.quantity')}
                      className="w-36"
                      size="small"
                      label={t('newListing.secondSection.quantity')}
                      InputProps={{
                        startAdornment: <TagIcon className="mr-2" />,
                      }}
                    />
                    <Select
                      id="condition"
                      name="condition"
                      size="small"
                      placeholder="Condition"
                      value={formData.condition}
                      onChange={handleConditionChange}
                      className="w-36"
                      renderValue={(value) => (
                        <>
                          <DiamondIcon className="mr-2" />
                          <span>{commonT(`conditions.${value}`)}</span>
                        </>
                      )}
                    >
                      <MenuItem disabled>
                        <i>{t('newListing.secondSection.condition')}</i>
                      </MenuItem>
                      <MenuItem value="poor">{commonT('conditions.poor')}</MenuItem>
                      <MenuItem value="played">{commonT('conditions.played')}</MenuItem>
                      <MenuItem value="good">{commonT('conditions.good')}</MenuItem>
                      <MenuItem value="excellent">{commonT('conditions.excellent')}</MenuItem>
                    </Select>
                  </div>
                  <div>
                    <div className="w-36">
                      <TextField
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handlePriceChange}
                        placeholder={t('newListing.secondSection.price')}
                        size="small"
                        label={t('newListing.secondSection.price')}
                        InputProps={{
                          startAdornment: <PaymentsIcon className="mr-2" />,
                          endAdornment: (
                            <span className="pl-2">
                              {
                                currencies.find((c) => c.code === user.currency_preference)
                                  ?.displayCurrency
                              }
                            </span>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Divider className="block lg:hidden" flexItem />
                {/* <Divider> is difficult to position vertically */}
                <div className="hidden lg:block border-l-2 h-[120px] self-end"></div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.is_trade_considered}
                        onChange={handleTradeCheckboxChange}
                      />
                    }
                    label={t('newListing.secondSection.tradeCheckbox')}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-2 md:gap-4">
            {props.editMode ? <DeleteListingButton onClick={deleteListing} /> : null}
            {!id ? null : <ClearListingButton />}
            {props.editMode ? (
              <ToggleVisibilityButton onClick={changeVisibility} public={formData.is_listed} />
            ) : null}
          </section>
        </div>
        <Divider />
        <div className="w-full overflow-auto">
          <h3 className="text-lg font-semibold mb-6">
            {t('newListing.secondSection.marketInformation')}
          </h3>
          <MarketTable
            className="w-full max-md:text-sm"
            page={page}
            onPageChange={changePage}
            count={cardListings.count}
          >
            <thead>
              <tr>
                <th className="hidden lg:table-cell" colSpan={3}>
                  {t('newListing.secondSection.marketTable.tableHeaders.seller')}
                </th>
                <th className="table-cell lg:hidden">
                  {t('newListing.secondSection.marketTable.tableHeaders.seller')}
                </th>
                <th colSpan={2}>
                  {t('newListing.secondSection.marketTable.tableHeaders.cardDetails')}
                </th>
                <th>{t('newListing.secondSection.marketTable.tableHeaders.available')}</th>
                <th>{t('newListing.secondSection.marketTable.tableHeaders.price')}</th>
              </tr>
            </thead>
            <tbody>
              {cardListings.results.map((l) => (
                <tr key={l.id}>
                  <td className="text-center w-16 hidden lg:table-cell">
                    <YugiohSellerRankBadge sales={900} />
                  </td>
                  <td className="text-center w-16 hidden lg:table-cell">
                    <YugiohSellerRankLabel sales={900} />
                  </td>
                  <td className="text-xl">
                    <Link
                      sx={{ color: '#0B70E5' }}
                      className="font-bold"
                      href={`/user/${l.user_name}`}
                      underline="hover"
                    >
                      {l.user_name}
                    </Link>
                  </td>
                  <td className="w-[50px]">
                    <YugiohCardConditionLabel className="w-[110px]" condition={l.condition} />
                  </td>
                  <td className="text-center">
                    <img
                      className="min-w-[40px] max-w-[40px] min-h-[20px] max-h-[20px] rounded-md inline-block"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1920px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
                    />
                    <br />
                  </td>
                  <td className="text-center text-xl p-1">{l.quantity}</td>
                  <td className="font-bold text-xl w-[200px]">
                    {l.price} {user.currency_preference}
                  </td>
                </tr>
              ))}
            </tbody>
          </MarketTable>
        </div>
      </PageSection>
    </section>
  );
}

export default ListingForm;
