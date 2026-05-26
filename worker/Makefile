PYTHON := python3
VENV_DIR := .venv
VENV_PY := $(VENV_DIR)/bin/python

# NGROK_DOMAIN from env (e.g. Doppler)
.PHONY: venv install test test-integration run-flask run-celery run-beat run-ngrok dev simulate-sms

venv:
	$(PYTHON) -m venv $(VENV_DIR)
	$(VENV_PY) -m pip install --upgrade pip

install:
	test -x $(VENV_PY) || $(PYTHON) -m venv $(VENV_DIR)
	$(VENV_PY) -m pip install --upgrade pip
	$(VENV_PY) -m pip install -r requirements.txt

install-dev: install
	$(VENV_PY) -m pip install -r requirements-dev.txt

test:
	test -x $(VENV_PY) || $(MAKE) install-dev
	$(VENV_PY) -m pytest tests/ -v -m "not integration"

test-integration:
	test -x $(VENV_PY) || $(MAKE) install-dev
	doppler run -- $(VENV_PY) -m pytest tests/test_property_retrieval_integration.py -v -m integration -s

run-flask:
	test -x $(VENV_PY) || $(MAKE) install
	doppler run -- bash -c '. $(VENV_DIR)/bin/activate && FLASK_APP=app.flask_app flask run --port 5002'

run-celery:
	test -x $(VENV_PY) || $(MAKE) install
	doppler run -- bash -c '. $(VENV_DIR)/bin/activate && celery -A app.celery_app worker -l info'

run-beat:
	test -x $(VENV_PY) || $(MAKE) install
	doppler run -- bash -c '. $(VENV_DIR)/bin/activate && celery -A app.celery_app beat -l info'

run-ngrok:
	doppler run -- ngrok http 5002 --domain=$$NGROK_DOMAIN

# Run Flask, Celery worker, Beat, and ngrok (env from Doppler)
dev:
	$(MAKE) -j 3 run-flask run-celery run-beat

# Simulate receive_sms without sending SMS (Twilio mocked). Requires active reservation for property + phone.
# Usage:
#   make simulate-sms property_id=b1b9e95e-b065-4434-a9bf-81101b04da9f phone="+19056096644" body="What's the WiFi?"
#   make simulate-sms property_id=b1b9e95e-b065-4434-a9bf-81101b04da9f phone="+19056096644" interactive=1
simulate-sms:
ifndef property_id
	$(error Set property_id= (UUID). Example: make simulate-sms property_id=b1b9e95e-... phone="+1..." body="Hello")
endif
ifndef phone
	$(error Set phone= (E.164). Example: make simulate-sms property_id=b1b9e95e-... phone="+19056096644" body="Hello")
endif
ifneq ($(interactive),1)
ifndef body
	$(error Set body="..." or interactive=1)
endif
endif
	test -x $(VENV_PY) || $(MAKE) install
	doppler run -- bash -c '. $(VENV_DIR)/bin/activate && python scripts/simulate_sms.py "$(property_id)" "$(phone)" $(if $(filter 1,$(interactive)),--interactive,"$(body)")'
