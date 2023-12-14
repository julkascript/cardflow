export type condition = 'poor' | 'played' | 'good' | 'excellent';

export type YugiohCardSet = {
  id: number;
  card_set_name: string;
  set_code: string;
};

export type YugiohCardRarity = {
  id: number;
  rarity: string;
  rarity_code: string;
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
  card_in_sets: YugiohCardSet;
};

export type YugiohCardListing = {
  id: number;
  card: number;
  card_name: string;
  card_set_id: number;

  /** This is the user's ID */
  user: number;

  user_name: string;
  price: number;
  condition: condition;
  quantity: number;
  is_listed: boolean;
  is_sold: boolean;
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
  set: YugiohCardSet;
  rarity: YugiohCardRarity;
};

/**
 * This is the type of the object returned by the ``/buy.yugioh/{id}`` loader
 */
export type CardDetailsLoaderData = {
  cardInSet: YugiohCardInSet;
};
