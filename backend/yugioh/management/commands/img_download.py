import logging
import os
import time

import requests
from django.core.management.base import BaseCommand

log_filename = "yugioh_image.log"
logging.basicConfig(filename=log_filename, level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class Command(BaseCommand):
    help = """
    Download YUGIOH card images from an external API.

    This management command fetches YUGIOH card images from an external API and saves them locally.

    Available commands:
      - onecard: Download images for a specific card (e.g., "Dark Magician").
      - staple: Download images for staple cards.
      - all: Download images for all YUGIOH cards.

    Usage:
      python manage.py download_images <command>

    Example:
      python manage.py download_images onecard
    """

    # API_URLS = {
    #     'onecard': "https://images.ygoprodeck.com/images/cards/55144522.jpg",
    #     'staple': "https://db.ygoprodeck.com/api/v7/cardinfo.php?staple=yes",
    #     # 'all': "https://db.ygoprodeck.com/api/v7/cardinfo.php",
    # }

    API_URLS = {
        'onecard': "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark Magician",
        'staple': "https://db.ygoprodeck.com/api/v7/cardinfo.php?staple=yes",
        'all': "https://db.ygoprodeck.com/api/v7/cardinfo.php",
    }

    IMAGE_SAVE_PATH = "media/yugioh_card_images"

    def add_arguments(self, parser):
        parser.add_argument(
            'command',
            type=str,
            choices=['onecard', 'staple', 'all'],
            help='Type of images to download'
        )

    def handle(self, *args, **options):

        api_url = self.API_URLS.get(options['command'])

        if not api_url:
            self.stdout.write(self.style.ERROR(f'Invalid command: {options["command"]}. Please check help options.'))
            logging.error(f'Invalid command: {options["command"]}. Please check help options.')
            return

        response = requests.get(api_url)

        if response.status_code == 200:
            self.stdout.write(f'For {api_url} -> response code {response.status_code} OK')
            logging.info(f'For {api_url} -> response code {response.status_code} OK')
            data = response.json()
        else:
            self.stdout.write(self.style.ERROR(f'API request failed with status code {response.status_code}'))
            logging.error(f'API request FAILED with status code {response.status_code} for {api_url}')
            return

        for item in data['data']:
            start_time = time.time()

            try:
                image_url = item['card_images'][0]['image_url']
            except (KeyError, IndexError):
                image_url = "NULL"
                #                 self.stdout.write('KeyError or IndexError for image')
                logging.info('KeyError or IndexError for image')

            if image_url == 'NULL':
                self.stdout.write(f'For {item.get("name")} -> no image')
                logging.error(f'For {item.get("name")} -> no image')
                continue

            self.stdout.write(f'Calling the external API - {image_url}')
            logging.info(f'Calling the external API - {image_url}')

            headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0",
                       "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                       "Accept-Language": "en-US,en;q=0.9"
                       }

            image_response = requests.get(image_url, headers=headers, stream=True)

            image_name = image_url.split('/')[-1]

            if image_response.status_code == 200:
                if not os.path.exists(self.IMAGE_SAVE_PATH):
                    os.makedirs(self.IMAGE_SAVE_PATH)

                image_filename = os.path.join(self.IMAGE_SAVE_PATH, image_name)

                with open(image_filename, 'wb') as handler:
                    for chunk in image_response.iter_content(chunk_size=8192):
                        handler.write(chunk)

                self.stdout.write(f'Downloaded image from {image_url} and saved as {image_filename}')
                logging.info(f'Downloaded image from {image_url} and saved as {image_filename}')
            else:
                self.stdout.write(
                    self.style.ERROR(
                        f'Failed to download image from {image_url} with status code {image_response.status_code}'))
                logging.error(
                    f'Failed to download image from {image_url} with status code {image_response.status_code}')

            end_time = time.time()
            elapsed_time = end_time - start_time
            self.stdout.write(f"Elapsed time: {elapsed_time}")

            if elapsed_time < 1:
                self.stdout.write(f"Waiting: {1 - elapsed_time} before next call")
                time.sleep(1 - elapsed_time)

