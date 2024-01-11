import { useState } from 'react';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import { CardDetailsLoaderData, YugiohCardSellListing } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import YugiohCardMarket from '../../components/yugioh/table/market/YugiohCardMarket';
import { Pagination } from '@mui/material';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';

function SellListing(): JSX.Element {
  const [page, setPage] = useState(1);
  const data = useLoaderData() as CardDetailsLoaderData;
  const params = useParams();
  const { cardInSet, cardListings: cardListingsData } = data;
  const [cardListings, setCardListings] = useState(cardListingsData);
  const [formData, setFormData] = useState<YugiohCardSellListing>({
    quantity: 0,
    condition: 'poor',
    price: 0,
    is_sold: true,
    is_listed: true,
    card: Number(params.id),
  });

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

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const newData: YugiohCardSellListing = {
        quantity: Number(formData.quantity),
        condition: 'poor',
        price: Number(formData.price),
        is_sold: true,
        is_listed: true,
        card: Number(params.id),
      };
      const data = await yugiohService.sellCardListing(newData);
      console.log(data); // Handle the response data as needed
    } catch (error) {
      console.error('Error posting data', error);
    }
  }

  const pages = Math.ceil(cardListings.count / 10);
  function changePage(_event: React.ChangeEvent<unknown>, page: number) {
    yugiohService
      .getCardListingsByCardSetId(Number(params.id), page)
      .then((data) => {
        setCardListings(data);
        setPage(page);
      })
      .catch(() => {}); // TO-DO: implement feedback for failed requests.
  }

  useEffectAfterInitialLoad(() => {
    yugiohService.getCardListingsByCardSetId(Number(params.id)).then(setCardListings).catch();
    setPage(1);
  }, [params.id]);
  return (
    <section className="bg-[#F5F5F5]">
      <ListingTopBar />
      <NewListingTopBar handleSubmit={handleSubmit} />
      <div className="block mt-20 ml-40 mr-40 bg-white rounded-lg">
        <div className="flex p-8 flex-col border border-stone-300">
          <div className="bg-white ml-16 p-8 w-[314px] h-[422px] flex">
            <img src={cardInSet.yugioh_card.image} />
            <div>
              <div>
                <h3
                  className="ml-8 text-black text-nowrap text-4xl font-medium"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cardInSet.yugioh_card.card_name}
                </h3>
                <Link
                  to="/listing/newlisting"
                  className="absolute flex items-center w-20 h-8 right-48 top-96 text-sm text-gray-700 border border-stone-300 px-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <img src="/images/trash-can.png" className="w-4 h-4 mr-1" />
                  Clear
                </Link>
              </div>
              <div className="flex">
                <div className="w-[61px] h-[23px] rounded-[10px] text-center ml-8 mt-4 border border-neutral-300">
                  {cardInSet.set.set_code}
                </div>
                <div className="w-[61px] h-[23px] rounded-[10px] text-center ml-4 mt-4 border border-neutral-300">
                  {cardInSet.rarity.rarity_code}
                </div>
              </div>
              <div className="flex mt-20">
                <div className="inline-flex items-center p-1 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <img src="/images/hashtag.png" className="w-4 h-4 mr-1" />
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
                    <img src="/images/jewel.png" className="w-4 h-4 mr-1" />
                  </span>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-28 px-2 py-0.5 text-sm text-left text-gray-700 border-none focus:ring-0 focus:outline-none"
                  >
                    <option value="poor">Poor</option>
                    <option value="good">Good</option>
                    <option value="played">Played</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center p-1 mt-16 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <img src="/images/cash.png" className="w-4 h-4 mr-1" />
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
          <h3 className="ml-32 text-lg font-semibold mb-4 pt-4">Market information</h3>
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

export default SellListing;
