PYTHON := python3
VENV_DIR := .venv
VENV_BIN := $(VENV_DIR)/bin
ENV_FILE := .env

.PHONY: venv install run-flask run-celery dev

venv:
	$(PYTHON) -m venv $(VENV_DIR)

install: venv
	$(VENV_BIN)/pip install --upgrade pip
	$(VENV_BIN)/pip install -r requirements.txt

run-flask:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	. $(VENV_BIN)/activate && \
	set -a && . $(ENV_FILE) && set +a && \
	FLASK_APP=app.flask_app flask run --port 5000

run-celery:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	. $(VENV_BIN)/activate && \
	set -a && . $(ENV_FILE) && set +a && \
	celery -A app.celery_app worker -l info

# Run Flask and Celery together (local dev / simple VM)
dev:
	make -j 2 run-flask run-celery

