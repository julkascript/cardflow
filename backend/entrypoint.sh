#!/bin/sh

# shellcheck disable=SC1073
if [ -f .env ]; then
  export $(dotenv)
  fi



if [ ! -d "keys" ]; then
  mkdir keys
fi

if [ ! -f "keys/jwtRS256.key" ]; then
  echo "Generating jwtRS256.key..."
  ssh-keygen -t rsa -b 4096 -m PEM -f keys/jwtRS256.key -N ""
  echo "Generated"
fi

# Check if jwtRS256.key.pub file exists, if not, generate it
if [ ! -f "keys/jwtRS256.key.pub" ]; then
  echo "Generating jwtRS256.key.pub..."
  ssh-keygen -e -m PEM -f keys/jwtRS256.key > keys/jwtRS256.key.pub
  echo "Generated"
fi

echo "Waiting for postgres..."

while ! nc -z 'postgres' $POSTGRES_PORT; do
  echo "Zzz"
  sleep 0.5
done

echo "PostgreSQL started"

python manage.py migrate


exists=$(python manage.py shell -c 'import django; django.setup(); from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(username="admin").exists())' | tr -d '\n')

if [ "$exists" = "False" ]; then
  echo "Creating superuser..."
  python manage.py shell -c "import django; django.setup(); from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', '$PGADMIN_DEFAULT_EMAIL', password='$PGADMIN_DEFAULT_PASSWORD')"
  echo "Superuser created"
else
  echo "Superuser already exists. Skipping creation."
fi


# cron &
# crontab /etc/cron.d/crontab

#python manage.py crontab add
#python manage.py crontab show

# python manage.py runserver 0.0.0.0:8000

python manage.py collectstatic

#python manage.py runserver 0.0.0.0:8000

gunicorn cardflow.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4
# exec "$@"
