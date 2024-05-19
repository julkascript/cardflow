#!/bin/sh
if [ -z "$1" ]; then
  echo "No mode specified (DEV | PRD)"
  exit 1
fi

MODE=$1

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

if ["$MODE" = "PRD"]; then
  python manage.py collectstatic
fi

python manage.py runserver 0.0.0.0:8000

if ["$MODE" = "PRD"]; then
  gunicorn cardflow.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4
fi

# exec "$@"