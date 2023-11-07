import logging


import requests
from card.models import Card
from django.core.management.base import BaseCommand
from game.models import Game
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

        self.stdout.write('Calling the external API')
        logging.info('Calling the external API')

        response = requests.get(api_url)

        if response.status_code == 200:
            self.stdout.write('API response received successfully')
            logging.info('API response received successfully')
            data = response.json()
        else:
            self.stdout.write(self.style.ERROR(f'API request failed with status code {response.status_code}'))
            logging.error(f'API request failed with status code {response.status_code}')
            return

        if not Game.objects.filter(game_name="Yu-Gi-Oh!").exists():
            self.stdout.write('Game does not exist... Creating')
            logging.info('Game does not exist... Creating')

            Game.objects.create(game_name="Yu-Gi-Oh!")

        processed_entries = 0

        for item in data['data']:
            self.stdout.write('Reading Card Details')
            logging.info('Reading Card Details')

            card_name = item['name']
            type = item['type']
            frame_type = item['frameType']
            desc = item['desc']
            try:
                atk = item['atk']
            except KeyError:
                atk = "NULL"
                self.stdout.write('KeyError for atk')
                logging.info('KeyError for atk')

            try:
                defense = item['def']
            except KeyError:
                defense = "NULL"
                self.stdout.write('KeyError for defense')
                logging.info('KeyError for defense')

            try:
                level = item['level']
            except KeyError:
                level = "NULL"
                self.stdout.write('KeyError for level')
                logging.info('KeyError for level')

            try:
                race = item['race']
            except KeyError:
                race = "NULL"
                self.stdout.write('KeyError for race')
                logging.info('KeyError for race')

            try:
                attribute = item['attribute']
            except KeyError:
                attribute = "NULL"
                self.stdout.write('KeyError for attribute')
                logging.info('KeyError for attribute')

            try:
                archetype = item['archetype']
            except KeyError:
                archetype = "NULL"
                self.stdout.write('KeyError for archetype')
                logging.info('KeyError for archetype')

            try:
                image = item['card_images'][0]['image_url']
            except (KeyError, IndexError):
                image = "NULL"
                self.stdout.write('KeyError or IndexError for image')
                logging.info('KeyError or IndexError for image')

            game = Game.objects.filter(game_name="Yu-Gi-Oh!").first()

            card = Card.objects.filter(card_name=card_name).first()

            if not card:
                self.stdout.write('Card does not exist... Creating')
                logging.info('Card does not exist... Creating')

                yugioh_card_object = YugiohCard.objects.create(
                    game=game,
                    card_name=card_name,
                    type=type,
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
            else:
                self.stdout.write(f'{card.card_name} card already exists... Checking the sets')
                logging.info(f'{card.card_name} card already exists... Checking the sets')
                yugioh_card_object = YugiohCard.objects.filter(card_name=card.card_name).first()

            for entry in item['card_sets']:
                processed_entries += 1

                progress_message = f'Processed {processed_entries}'
                self.stdout.write(progress_message, ending='\r')
                self.stdout.flush()

                card_set_name = entry["set_name"]
                card_set_code = entry["set_code"]
                rarity = entry["set_rarity"]
                rarity_code = entry["set_rarity_code"]

                rarity_object = YugiohCardRarity.objects.filter(rarity=rarity, rarity_code=rarity_code).first()

                card_set_object = YugiohCardSet.objects.filter(card_set_name=card_set_name,
                                                               set_code=card_set_code).first()

                if not rarity_object:
                    self.stdout.write('Rarity does not exist... Creating')
                    logging.info('Rarity does not exist... Creating')
                    rarity_object = YugiohCardRarity.objects.create(rarity=rarity, rarity_code=rarity_code)

                if not card_set_object:
                    self.stdout.write('Cardset does not exist... Creating')
                    logging.info('Cardset does not exist... Creating')
                    card_set_object = YugiohCardSet.objects.create(card_set_name=card_set_name,
                                                                   set_code=card_set_code)

                existing_card = YugiohCardInSet.objects.filter(
                    rarity=rarity_object,
                    set=card_set_object,
                    yugioh_card=yugioh_card_object
                ).first()

                if not existing_card:
                    YugiohCardInSet.objects.create(rarity=rarity_object, set=card_set_object,
                                                   yugioh_card=yugioh_card_object)
                else:
                    self.stdout.write(self.style.ERROR(f'Card {yugioh_card_object} '
                                                       f'{card_set_object} {rarity_object}... Skipping'))
                    logging.info(f'Card {yugioh_card_object} with '
                                 f'{card_set_object} {rarity_object}... Skipping')

        self.stdout.write(self.style.SUCCESS(f'DONE!'))
        logging.info('DONE!')
        self.stdout.write("")
