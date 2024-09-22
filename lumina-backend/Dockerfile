# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc \
  g++ \
  make \
  libatlas-base-dev \
  && rm -rf /var/lib/apt/lists/*

COPY ../requirements.lock ./
RUN sed '/-e/d' requirements.lock > requirements.txt
RUN pip install -r requirements.txt


# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application
# Note: In production, you might want to use a production-ready server like gunicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Hint: Build this image using:
# docker build -t lumina-backend .
# Run the container using:
# docker run -p 8000:8000 lumina-backend