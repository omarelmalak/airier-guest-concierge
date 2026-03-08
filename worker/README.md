# Worker (Flask + Celery)

Internal Python service: Flask receives HTTP from Rails and enqueues Celery tasks; Celery consumes from RabbitMQ and calls Twilio.

## Setup

1. Copy `.env.example` to `.env` and set Twilio credentials and `RABBITMQ_URL` if needed.
2. Create a venv and install deps:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate   # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. Start RabbitMQ (e.g. `brew services start rabbitmq` or Docker).

## Run (two processes, same machine)

Terminal 1 — Flask (Rails POSTs here):

```bash
cd worker
source .venv/bin/activate
export FLASK_APP=app.flask_app
flask run --port 5000
```

Terminal 2 — Celery worker (consumes from RabbitMQ, sends SMS):

```bash
cd worker
source .venv/bin/activate
celery -A app.celery_app worker -l info
```

## Rails

Set in backend `.env`:

- `WORKER_API_URL=http://localhost:5000`

Then `POST /api/v1/messages/sms` with body `{ "to": "+1...", "body": "..." }` will be validated by Rails and forwarded to Flask, which enqueues the send_sms task; the Celery worker will send via Twilio.
