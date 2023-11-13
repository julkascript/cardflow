#!/bin/sh

if [ -f .env ]; then
  # shellcheck disable=SC2046
  export $(dotenv list -e)
fi

echo "Waiting for postgres..."

while ! nc -z 'postgres' 5432; do
  echo "Zzz"
  sleep 0.5
done

echo "PostgreSQL started"



python manage.py flush --no-input
python manage.py migrate

if [ -z "$(python manage.py shell -c "from django.contrib.auth.models import User;
 print(User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists())")" ]; then
  echo "Creating $DJANGO_SUPERUSER_USERNAME superuser..."
  python manage.py createsuperuser --no-input
else
  echo "$DJANGO_SUPERUSER_USERNAME superuser already exists. Skipping creation."
fi



python manage.py runserver 0.0.0.0:8000
