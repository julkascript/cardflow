FROM python:3.11.4-slim-buster

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y netcat libpq-dev gcc openssh-client

RUN pip install --upgrade pip

COPY ./sample.env .env

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY ./entrypoint.sh .

COPY ./ .

RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]