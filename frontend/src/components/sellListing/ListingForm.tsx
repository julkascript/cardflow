import {
  SelectChangeEvent,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  Divider,
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
import { errorToast } from '../../util/errorToast';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import YugiohCardMarket from '../yugioh/table/market/YugiohCardMarket';
import CardflowTabs from './CardflowTabs';
import NewListingTopBar from './NewListingTopBar';
import PaymentsIcon from '@mui/icons-material/Payments';
import DeleteIcon from '@mui/icons-material/Delete';
import DiamondIcon from '@mui/icons-material/Diamond';
import TagIcon from '@mui/icons-material/Tag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageSection from '../PageSection';

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

    // Allow zero so users can input prices like 0.99 without issues
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

  function delistItem() {
    yugiohService.editListing({ ...formData, is_listed: !formData.is_listed }).catch(errorToast);
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
      .getCardListingsByCardSetId(id, page)
      .then((data) => {
        setCardListings(data);
        setPage(page);
      })
      .catch(errorToast);
  }

  useEffectAfterInitialLoad(() => {
    yugiohService.getCardListingsByCardSetId(id).then(setCardListings).catch(errorToast);
    setPage(1);
  }, [id]);
  return (
    <section className="bg-[#F5F5F5]">
      <CardflowTabs />
      <NewListingTopBar
        handleSubmit={handleSubmit}
        quantity={formData.quantity}
        price={formData.price}
      />
      <PageSection className="w-5/6 mx-auto p-8 flex flex-col gap-8">
        <div className="flex justify-between flex-wrap">
          <section className="flex gap-8">
            <img src={props.cardInSet.yugioh_card.image} className="w-[314px] h-[422px]" />
            <div>
              <h3 className="text-nowrap text-4xl font-medium">
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
              <div className="flex lg:hidden">
                <Chip color="secondary" variant="outlined" label={props.cardInSet.set.set_code} />
                <Chip
                  color="secondary"
                  variant="outlined"
                  label={props.cardInSet.rarity.rarity_code}
                />
              </div>
              <div className="flex flex-col mt-20 gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <TextField
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="Quantity"
                    className="w-40"
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
                    className="w-40"
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
                  <div className="w-40">
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
          <section className="flex flex-col gap-4">
            {props.editMode ? (
              <Button size="small" color="error" variant="outlined" onClick={deleteListing}>
                Delete
              </Button>
            ) : null}
            {!id ? null : (
              <Button size="small" href="/sell/new" variant="outlined" startIcon={<DeleteIcon />}>
                Clear
              </Button>
            )}
            {props.editMode ? (
              <Button
                size="small"
                onClick={delistItem}
                variant="outlined"
                startIcon={<VisibilityIcon />}
              >
                Delist
              </Button>
            ) : null}
          </section>
        </div>
        <Divider />
        <div>
          <h3 className="text-lg font-semibold mb-6">Market information</h3>
          <YugiohCardMarket
            page={page}
            onChangePage={changePage}
            count={cardListings.count}
            listings={cardListings.results}
          />
        </div>
      </PageSection>
    </section>
  );
}

export default ListingForm;
