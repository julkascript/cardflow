import { useEffect, useState } from 'react';
import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import {
  ListingDetailsLoaderData,
  YugiohCardInSet,
  YugiohCardListing,
  YugiohCardSellListing,
} from '../../services/yugioh/types';
import { useCurrentUser } from '../../context/user';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import YugiohCardMarket from '../../components/yugioh/table/market/YugiohCardMarket';
import { Pagination } from '@mui/material';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';
import PaymentsIcon from '@mui/icons-material/Payments';
import DiamondIcon from '@mui/icons-material/Diamond';
import TagIcon from '@mui/icons-material/Tag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { errorToast } from '../../util/errorToast';
import toast from 'react-hot-toast';
import { toastMessages } from '../../constants/toast';

function EditListing(): JSX.Element {
  const [page, setPage] = useState(1);
  const data = useLoaderData() as ListingDetailsLoaderData;
  const params = useParams();
  const id = Number(params.id);
  const { cardListings: cardListingsData } = data;
  const [cardListings, setCardListings] = useState(cardListingsData);
  const navigate = useNavigate();
  const { user: currentUser } = useCurrentUser();
  const [cardId, setCardId] = useState(0);
  const [cardInSet, setCardInSet] = useState<YugiohCardInSet>();

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
          if (currentUser.user_id !== user) {
            navigate('/sell/manage');
          }
          setCardId(card);
          const cardInSet = await yugiohService.getCardInSetById(card);
          setCardInSet(cardInSet);
          setFormData(() => ({
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
          }));
        }
      } catch (error) {
        errorToast(error);
      }
    }
    loadCardListing();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let newValue: string | boolean = value;

    if (type === 'checkbox') {
      // 'checked' is only a property on input elements, specifically checkboxes
      newValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  async function deleteListing() {
    try {
      await yugiohService.deleteListingById(Number(params.id));
      navigate('/sell/manage');
      toast.success(
        toastMessages.success.listingDeleted(
          cardInSet?.yugioh_card.card_name || '',
          cardInSet?.set.set_code || '',
        ),
      );
    } catch (error) {
      errorToast(error);
    }
  }
  function delistItem() {
    yugiohService
      .editListing({ ...formData, is_listed: !formData.is_listed })
      .then((data) =>
        toast.success(
          toastMessages.success.listingVisibilityChanged(
            data.card_name,
            data.card_in_set.set.set_code,
            !formData.is_listed,
          ),
        ),
      )
      .catch(errorToast);
  }

  async function updateListing(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const newData: Partial<YugiohCardSellListing> = {
        quantity: Number(formData.quantity),
        condition: formData.condition,
        price: Number(formData.price),
        is_listed: formData.is_listed,
      };
      const listing = await yugiohService.updateCardListing(newData, id);
      toast.success(
        toastMessages.success.listingUpdated(listing.card_name, listing.card_in_set.set.set_code),
      );
    } catch (error) {
      errorToast(error);
    }
  }

  const pages = Math.ceil(cardListings.count / 10);
  function changePage(_event: React.ChangeEvent<unknown>, page: number) {
    yugiohService
      .getCardListingsByCardSetId(cardId, page)
      .then((data) => {
        setCardListings(data);
        setPage(page);
      })
      .catch(errorToast);
  }

  useEffectAfterInitialLoad(() => {
    yugiohService.getCardListingsByCardSetId(cardId).then(setCardListings).catch(errorToast);
    setPage(1);
  }, [cardId]);
  return (
    <section className="bg-[#F5F5F5]">
      <ListingTopBar />
      <NewListingTopBar
        handleSubmit={updateListing}
        quantity={formData.quantity}
        price={formData.price}
        condition={formData.condition}
        card={Number(cardId)}
      />
      <div className="block mt-20 ml-40 mr-40 bg-white rounded-lg">
        <div className="flex flex-col border border-stone-300">
          <div className="bg-white ml-4 p-8 w-[314px] h-[422px] flex">
            <img src={cardInSet?.yugioh_card.image} />
            <div>
              <div>
                <h3
                  className="ml-8 text-black text-nowrap text-4xl font-medium"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cardInSet?.yugioh_card.card_name}
                </h3>
                <div className="absolute right-48 top-80">
                  <button
                    onClick={deleteListing}
                    className=" flex justify-center items-center w-20 h-8  mt-4 text-sm text-gray-700 border border-stone-300 pl-3 pr-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Delete
                  </button>

                  <button
                    onClick={delistItem}
                    className=" flex justify-center items-center w-20 h-8  mt-4 text-sm text-gray-700 border border-stone-300 pl-3 pr-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <VisibilityIcon className="p-1" />
                    Delist
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className="w-[61px] h-[23px] rounded-[10px] text-neutral-500 text-sm font-normal text-center ml-8 mt-4 border border-neutral-300">
                  {cardInSet?.set.set_code}
                </div>
                <div className="w-[61px] h-[23px] rounded-[10px] text-neutral-500 text-sm font-normal text-center ml-4 mt-4 border border-neutral-300">
                  {cardInSet?.rarity.rarity_code}
                </div>
              </div>
              <div className="flex mt-20">
                <div className="inline-flex items-center p-1 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <TagIcon />
                  </span>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-24 px-2 py-0.5 text-sm text-gray-700 border-none focus:ring-0 focus:outline-none"
                    placeholder="Quantity"
                  />
                </div>
                <div className="inline-flex items-center p-1 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <DiamondIcon />
                  </span>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-28 px-2 py-0.5 text-sm text-left text-gray-700 border-none focus:ring-0 focus:outline-none"
                  >
                    <option value="poor">Poor</option>
                    <option value="played">Played</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center p-1 mt-16 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <PaymentsIcon />
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-24 px-2 py-0.5 text-sm text-gray-700 border-none focus:ring-0 focus:outline-none"
                    placeholder="Price"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-b border-l border-r border-stone-300">
          <h3 className="ml-12 text-lg font-semibold mb-4 pt-4">Market information</h3>
          <YugiohCardMarket listings={cardListings.results} />
          <Pagination
            page={page}
            className="flex justify-center pb-8"
            count={pages}
            onChange={changePage}
          />
        </div>
      </div>
    </section>
  );
}

export default EditListing;
