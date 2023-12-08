Create a new Python virtual environment within this directory:

```bash
python3 -m venv venv
```

Activate the virtual environment. On Mac/Linux:

```bash
source venv/bin/activate
``````

Install the required packages:

```bash
pip install -r requirements.txt
```

After any dependency changes, update the requirements file:

```bash
pip freeze > requirements.txt
```

## Running the app

```bash
python app.py
```

## Build the docker image

```bash
docker build -t api .
```
