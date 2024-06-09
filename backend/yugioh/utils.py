import os

import requests
from django.conf import settings


def fetch_and_save_image(image_url):
    external_image_url = image_url

    local_image_name = image_url.split('/')[-1]

    media_path = os.path.join(settings.MEDIA_ROOT, 'yugioh_card_images')

    image_file_name = os.path.join(media_path, local_image_name)

    if not os.path.exists(media_path):
        os.makedirs(media_path)

    if not os.path.exists(image_file_name):

        image_response = requests.get(external_image_url, stream=True)

        if image_response.status_code == 200:

            with open(image_file_name, 'wb') as handler:
                for chunk in image_response.iter_content(chunk_size=8192):
                    handler.write(chunk)
        else:

            return None

    return f"{settings.MEDIA_URL}yugioh_card_images/{local_image_name}"
