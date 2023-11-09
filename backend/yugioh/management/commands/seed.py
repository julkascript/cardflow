import logging

import requests
from card.models import Card
from django.core.management.base import BaseCommand
from game.models import Game
from psycopg2 import DataError
from yugioh.models import YugiohCard, YugiohCardRarity, YugiohCardSet, YugiohCardInSet

log_filename = "yugioh_seeding.log"
logging.basicConfig(filename=log_filename, level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class Command(BaseCommand):
    help = """
    Seed the database with YUGIOH card data from an external API.

    This management command fetches YUGIOH card data from an external API and stores it in the database.

    Available commands:
      - onecard: Seed data for a specific card (e.g., "Dark Magician").
      - staple: Seed data for staple cards.
      - all: Seed data for all YUGIOH cards.

    Usage:
      python manage.py seed <command>

    Example:
      python manage.py seed onecard
    """

    API_URLS = {
        'onecard': "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark Magician",
        'staple': "https://db.ygoprodeck.com/api/v7/cardinfo.php?staple=yes",
        'all': "https://db.ygoprodeck.com/api/v7/cardinfo.php",
    }

    GAME_NAME = "Yu-Gi-Oh!"

    def add_arguments(self, parser):
        parser.add_argument(
            'command',
            type=str,
            choices=['onecard', 'staple', 'all'],
            help='Type of data to seed the database with'
        )

    def handle(self, *args, **options):

        """

        Fetch and store YUGIOH card data based on the chosen command.
        Args:
            <command> (str): The type of data to seed the database with (onecard, staple, or all).

        """

        api_url = self.API_URLS.get(options['command'])

        if not api_url:
            self.stdout.write(self.style.ERROR(f'Invalid command: {options["command"]}. Please check help options.'))
            logging.error(f'Invalid command: {options["command"]}. Please check help options.')
            return

        self.stdout.write(f'Calling the external API - {api_url}')
        logging.info(f'Calling the external API - {api_url}')

        response = requests.get(api_url)

        if response.status_code == 200:
            self.stdout.write(f'For {api_url} -> response code {response.status_code} OK')
            logging.info(f'For {api_url} -> response code {response.status_code} OK')
            data = response.json()
        else:
            self.stdout.write(self.style.ERROR(f'API request failed with status code {response.status_code}'))
            logging.error(f'API request FAILED with status code {response.status_code} for {api_url}')
            return

        game, is_game_created = Game.objects.get_or_create(game_name=self.GAME_NAME)

        if is_game_created:
            self.stdout.write(f'Game {self.GAME_NAME} does not exist... Created')
        else:
            self.stdout.write(f'Game {self.GAME_NAME} exists... Skipping')

        processed_cards = 0
        processed_sets = 0
        imported_card = 0
        imported_set = 0

        for item in data['data']:

            processed_cards += 1

            card_name = item.get('name', 'NULL')
            card_type = item.get('type', 'NULL')
            frame_type = item.get('frameType', 'NULL')
            desc = item.get('desc', 'NULL')

            if card_name == 'NULL':
                logging.info(f'KeyError for card name {card_name}')
            if card_type == 'NULL':
                logging.info(f'KeyError for type {card_type}')
            if frame_type == 'NULL':
                logging.info(f'KeyError for frameType {frame_type}')
            if desc == 'NULL':
                logging.info('KeyError for desc')

            logging.info(f'Reading card ** {card_name} ** Details')

            if len(desc) >= 1000:
                desc = item['desc'][:990] + '...'

            atk = item.get('atk', 'NULL')
            defense = item.get('def', 'NULL')
            level = item.get('level', 'NULL')
            race = item.get('race', 'NULL')
            attribute = item.get('attribute', 'NULL')
            archetype = item.get('archetype', 'NULL')

            try:
                image = item['card_images'][0]['image_url']
            except (KeyError, IndexError):
                image = "NULL"
                #                 self.stdout.write('KeyError or IndexError for image')
                logging.info('KeyError or IndexError for image')

            game = Game.objects.filter(game_name="Yu-Gi-Oh!").first()

            card = Card.objects.filter(card_name=card_name).first()

            if not card:
                self.stdout.write(f'Card {card_name} does not exist... Creating')
                logging.info(f'Card {card_name} does not exist... Creating')

                try:
                    yugioh_card_object = YugiohCard.objects.create(
                        game=game,
                        card_name=card_name,
                        type=card_type,
                        frame_type=frame_type,
                        description=desc,
                        attack=atk,
                        defense=defense,
                        level=level,
                        race=race,
                        attribute=attribute,
                        archetype=archetype,
                        image=image,
                    )

                    imported_card += 1

                except DataError:
                    self.stdout.write(f'DataError for {card_name}')
                    continue

            else:
                self.stdout.write(f'{card.card_name} card already exists... Checking the sets')
                logging.info(f'{card.card_name} card already exists... Checking the sets')
                yugioh_card_object = YugiohCard.objects.filter(card_name=card.card_name).first()

            try:
                for entry in item['card_sets']:

                    processed_sets += 1

                    card_set_name = entry["set_name"]
                    card_set_code = entry["set_code"]
                    rarity = entry["set_rarity"]
                    rarity_code = entry["set_rarity_code"]

                    if rarity_code == '':
                        code_generation = rarity.split()
                        for word in code_generation:
                            rarity_code += word[0]

                    rarity_object, is_rarity_created = YugiohCardRarity.objects.get_or_create(rarity=rarity,
                                                                                              rarity_code=rarity_code)

                    card_set_object, is_cardset_created = YugiohCardSet.objects.get_or_create(
                        card_set_name=card_set_name,
                        set_code=card_set_code)

                    if is_rarity_created:
                        self.stdout.write(f'Rarity {rarity} does not exist... Creating')
                        logging.info(f'Rarity * {rarity} * does not exist... Creating')
                    else:
                        self.stdout.write(f'{rarity} exist... Skipping')
                        logging.info(f'{rarity} exist... Skipping')

                    if is_cardset_created:
                        self.stdout.write(f'Cardset {card_set_name} does not exist... Creating')
                        logging.info(f'Cardset {card_set_name} does not exist... Creating')
                    else:
                        self.stdout.write(f'Cardset {card_set_name} exist... Skipping')
                        logging.info(f'Cardset {card_set_name} exist... Skipping')

                    existing_card = YugiohCardInSet.objects.filter(
                        rarity=rarity_object,
                        set=card_set_object,
                        yugioh_card=yugioh_card_object
                    ).first()

                    if not existing_card:
                        YugiohCardInSet.objects.create(rarity=rarity_object, set=card_set_object,
                                                       yugioh_card=yugioh_card_object)

                        imported_set += 1

                    else:
                        self.stdout.write(self.style.ERROR(f'Card {yugioh_card_object} '
                                                           f'{card_set_object} {rarity_object}... Skipping'))
                        logging.info(f'Card {yugioh_card_object} with '
                                     f'{card_set_object} {rarity_object}... Skipping')
            except KeyError:
                logging.info(f'No sets for {card_name}')

        logging.info('')
        self.stdout.write("")
        self.stdout.write("DONE! Check results in the file yugioh_seeding.log")
