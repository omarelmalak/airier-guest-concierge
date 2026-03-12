from celery import Celery
import os

broker_url = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672//")
app = Celery("worker", broker=broker_url)
app.conf.task_serializer = "json"
app.conf.result_serializer = "json"
app.conf.task_acks_late = True
app.conf.task_reject_on_worker_lost = True
app.conf.enable_utc = True
app.conf.timezone = "UTC"

# Celery Beat schedule (poll every 60 seconds)
app.conf.beat_schedule = {
    "poll-due-auto-messages-every-60s": {
        "task": "app.tasks.poll_due_auto_messages",
        "schedule": 60.0,
    }
}

app.autodiscover_tasks(["app"])
