import { SelectChangeEvent, TextField, Select, MenuItem, Chip, Divider, Link } from '@mui/material';
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
import { errorToast } from '../../util/errorToast';
import CardflowTabs from './CardflowTabs';
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

const selectOptions: Record<condition, string> = {
  poor: 'Poor',
  played: 'Played',
  good: 'Good',
  excellent: 'Excellent',
};

type ListingFormProps = {
  editMode?: boolean;
  onSubmit: (data: YugiohCardSellListing, postAnother: boolean) => void;
  listing?: YugiohCardListing;
  listings: PaginatedItem<YugiohCardListing>;
  cardInSet: YugiohCardInSet;
};

function ListingForm(props: ListingFormProps) {
  const [page, setPage] = useState(1);
  const params = useParams();
  const id = Number(params.id);
  const [cardListings, setCardListings] = useState(props.listings);
  const navigate = useNavigate();

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
      errorToast(error);
    }
  }

  function changeVisibility() {
    yugiohService
      .editListing({ ...formData, is_listed: !formData.is_listed })
      .then(() => setFormData((state) => ({ ...state, is_listed: !state.is_listed })))
      .catch(errorToast);
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
      .catch(errorToast);
  }
  return (
    <section className="bg-[#F5F5F5] pb-4">
      <CardflowTabs />
      <NewListingTopBar
        handleSubmit={handleSubmit}
        quantity={formData.quantity}
        price={formData.price}
      />
      <PageSection className="w-11/12 mt-4 md:w-5/6 mx-auto p-4 md:p-8 flex flex-col gap-8">
        <div className="flex justify-between gap-4 md:gap-0">
          <section className="flex gap-4 md:gap-8">
            <img src={props.cardInSet.yugioh_card.image} className="w-1/2 lg:w-1/3" />
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
                  label={props.cardInSet.rarity.rarity_code}
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
                  label={props.cardInSet.rarity.rarity_code}
                />
              </div>
              <div className="flex flex-col mt-10 lg:mt-20 gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <TextField
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="Quantity"
                    className="w-36"
                    size="small"
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
                        <span>{selectOptions[value]}</span>
                      </>
                    )}
                  >
                    <MenuItem disabled>
                      <i>Condition</i>
                    </MenuItem>
                    <MenuItem value="poor">Poor</MenuItem>
                    <MenuItem value="played">Played</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="excellent">Excellent</MenuItem>
                  </Select>
                </div>
                <div>
                  <div className="w-36">
                    <TextField
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handlePriceChange}
                      placeholder="Price"
                      size="small"
                      InputProps={{
                        startAdornment: <PaymentsIcon className="mr-2" />,
                      }}
                    />
                  </div>
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
          <h3 className="text-lg font-semibold mb-6">Market information</h3>
          <MarketTable
            className="w-full"
            page={page}
            onPageChange={changePage}
            count={cardListings.count}
          >
            <thead>
              <tr>
                <th className="hidden lg:table-cell" colSpan={3}>
                  Seller
                </th>
                <th className="table-cell lg:hidden">Seller</th>
                <th colSpan={2}>Card details</th>
                <th>Available</th>
                <th>Price</th>
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
                  <td className="font-bold text-xl w-[200px]">$&nbsp;{l.price}</td>
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
