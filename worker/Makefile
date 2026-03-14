PYTHON := python3
VENV_DIR := .venv
VENV_BIN := $(VENV_DIR)/bin

.PHONY: venv install run-flask run-celery run-beat dev

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

# Run Flask, Celery worker, and Beat together (env from Doppler)
dev:
	$(MAKE) -j 3 run-flask run-celery run-beat

