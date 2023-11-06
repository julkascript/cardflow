# Use the official Python image as a parent image
FROM python:3

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container at the working directory
COPY requirements.txt /app/

COPY .env .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Run Django migrations during container build
RUN python manage.py makemigrations
RUN python manage.py migrate


CMD ["python", "manage.py", "runserver"]
