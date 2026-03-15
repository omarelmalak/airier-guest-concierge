PYTHON := python3
VENV_DIR := .venv
VENV_BIN := $(VENV_DIR)/bin

# NGROK_DOMAIN from env (e.g. Doppler)
.PHONY: venv install run-flask run-celery run-beat run-ngrok dev simulate-sms

venv:
	$(PYTHON) -m venv $(VENV_DIR)

install: venv
	$(VENV_BIN)/pip install --upgrade pip
	$(VENV_BIN)/pip install -r requirements.txt

run-flask:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	doppler run -- bash -c '. $(VENV_BIN)/activate && FLASK_APP=app.flask_app flask run --port 5002'

run-celery:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	doppler run -- bash -c '. $(VENV_BIN)/activate && celery -A app.celery_app worker -l info'

run-beat:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	doppler run -- bash -c '. $(VENV_BIN)/activate && celery -A app.celery_app beat -l info'

run-ngrok:
	doppler run -- ngrok http 5002 --domain=$$NGROK_DOMAIN

# Run Flask, Celery worker, Beat, and ngrok (env from Doppler)
dev:
	$(MAKE) -j 3 run-flask run-celery run-beat

# Simulate receive_sms without sending SMS (Twilio mocked). Requires phone with active reservation.
# Usage: make simulate-sms phone=+15551234567 body="What's the WiFi?"
#        make simulate-sms phone=+15551234567 interactive=1
simulate-sms:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	doppler run -- bash -c '. $(VENV_BIN)/activate && python scripts/simulate_sms.py $(phone) $(if $(filter 1,$(interactive)),--interactive,$(body))'
