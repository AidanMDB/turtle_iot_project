

# official python image
FROM python:3.10-slim

# set the working directory
WORKDIR /app

# copy over dependencies from requirements.txt
COPY requirements.txt .

# copy over the middleware script
COPY middleware.py .


# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# run the script
CMD ["python", "middleware.py"]