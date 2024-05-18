export type condition = 'poor' | 'played' | 'good' | 'excellent';

export type PaginatedItem<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type YugiohSet = {
  id: number;
  card_set_name: string;
  set_code: string;
};

export type YugiohCardRarity = {
  id: number;
  rarity: string;
  rarity_code: string;
};

export type YugiohCardSet = {
  card_in_set_id: number;
  set: YugiohSet;
  rarity: YugiohCardRarity;
};

export type YugiohCard = {
  id: number;
  card_name: string;
  type: string;
  frame_type: string;
  description: string;
  attack: string;
  defense: string;
  level: string;
  race: string;
  attribute: string;
  archetype: string;
  image: string;
  card_in_sets: YugiohCardSet[];
};

export type YugiohCardListing = {
  id: number;
  card: number;
  card_name: string;
  card_set_id: number;
  card_in_set: YugiohCardInSet;

  /** This is the user's ID */
  user: number;

  user_name: string;
  price: number;
  condition: condition;
  quantity: number;
  is_listed: boolean;
  is_sold: boolean;
};

export type BuyYugiohCardListing = {
  card: number;
  price: number;
  condition: condition;
  is_listed: boolean;
  is_sold: boolean;
};

export type YugiohCardSellListing = BuyYugiohCardListing & {
  quantity: number;
};

export type YugiohCardInSet = {
  id: number;
  yugioh_card: {
    id: number;
    card_name: string;
    type: string;
    frame_type: string;
    description: string;
    attack: string;
    defense: string;
    level: string;
    race: string;
    attribute: string;
    archetype: string;
    image: string;
  };
  set: YugiohSet;
  rarity: YugiohCardRarity;
};

/**
 * This is the type of the object returned by the ``/details/yugioh/{id}`` loader
 */
export type CardDetailsLoaderData = {
  cardInSet: YugiohCardInSet;
  cardListings: PaginatedItem<YugiohCardListing>;
};

export type EditListingLoaderData = {
  listing: YugiohCardListing;
  listings: PaginatedItem<YugiohCardListing>;
};

export type ListingDetailsLoaderData = {
  cardListings: PaginatedItem<YugiohCardListing>;
};

export type YugiohCardSearchResults = {
  cardName: string;
  card: YugiohCardSet;
};

export type YugiohCardSearchResultsDisplay = {
  total: number;
  results: YugiohCardSearchResults[];
};

export type CardSearchLoader = {
  cards: PaginatedItem<YugiohCardInSet>;
};

export type SellCardListing = {
  id: number;
  card: number;
  card_name: string;
  card_set_id: number;
  user: number;
  user_name: string;
  price: number;
  condition: string;
  quantity: number;
  is_listed: boolean;
  is_sold: boolean;
};

export type ShoppingCardListing = {
  listing: YugiohCardListing;
  rarity: string;
  set_code: string;
  boughtQuantity: number;
};
