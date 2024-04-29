import { SelectChangeEvent, Button, TextField, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import {
  CardDetailsLoaderData,
  YugiohCardListing,
  condition,
  YugiohCardSellListing,
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

const selectOptions: Record<condition, string> = {
  poor: 'Poor',
  played: 'Played',
  good: 'Good',
  excellent: 'Excellent',
};

type ListingFormProps = {
  editMode?: boolean;
  onSubmit: (data: YugiohCardSellListing, postAnother: boolean) => void;
};

function ListingForm(props: ListingFormProps) {
  const [page, setPage] = useState(1);
  const data = useLoaderData() as CardDetailsLoaderData;
  const params = useParams();
  const id = Number(params.id);
  const { cardInSet, cardListings: cardListingsData } = data;
  const [cardListings, setCardListings] = useState(cardListingsData);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<YugiohCardListing>({
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
  });

  useEffect(() => {
    async function loadCardListing() {
      try {
        const currentCard: YugiohCardListing = await yugiohService.getListingById(
          Number(params.id),
        );
        const {
          card,
          quantity,
          condition,
          price,
          is_listed,
          is_sold,
          id,
          user_name,
          user,
          card_name,
          card_set_id,
        } = currentCard;
        if (currentCard && currentCard !== null) {
          setFormData({
            card,
            quantity,
            condition,
            price,
            is_sold,
            is_listed,
            id,
            user_name,
            user,
            card_name,
            card_set_id,
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
          });
        }
      } catch (error) {
        errorToast(error, undefined, 404);
      }
    }

    loadCardListing();
  }, [params.id]);

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
      card: id,
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
      <div className="block mt-20 ml-40 mr-40 bg-white rounded-lg">
        <div className="flex flex-col border border-stone-300">
          <div className="bg-white ml-4 p-8 w-[314px] h-[422px] flex">
            <img src={cardInSet.yugioh_card.image} />
            <div>
              <div>
                <h3
                  className="ml-8 text-black text-nowrap text-4xl font-medium"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cardInSet.yugioh_card.card_name}
                </h3>
                <div className="absolute right-48 top-80">
                  {id ? (
                    <Button color="error" variant="outlined" onClick={deleteListing}>
                      Delete
                    </Button>
                  ) : null}
                  {id ? null : (
                    <Button href="/sell/new" variant="outlined" startIcon={<DeleteIcon />}>
                      Clear
                    </Button>
                  )}
                  {id ? (
                    <Button onClick={delistItem} variant="outlined" startIcon={<VisibilityIcon />}>
                      Delist
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="flex">
                <div className="w-[61px] h-[23px] rounded-[10px] text-neutral-500 text-sm font-normal text-center ml-8 mt-4 border border-neutral-300">
                  {cardInSet.set.set_code}
                </div>
                <div className="w-[61px] h-[23px] rounded-[10px] text-neutral-500 text-sm font-normal text-center ml-4 mt-4 border border-neutral-300">
                  {cardInSet.rarity.rarity_code}
                </div>
              </div>
              <div className="flex mt-20">
                <div className="w-40">
                  <TextField
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="Quantity"
                    size="small"
                    InputProps={{
                      startAdornment: <TagIcon className="mr-2" />,
                    }}
                  />
                </div>
                <div>
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
        </div>
        <div className="w-full border-b border-l border-r border-stone-300">
          <h3 className="ml-12 text-lg font-semibold mb-4 pt-4">Market information</h3>
          <YugiohCardMarket
            page={page}
            onChangePage={changePage}
            count={cardListings.count}
            listings={cardListings.results}
          />
        </div>
      </div>
    </section>
  );
}

export default ListingForm;
