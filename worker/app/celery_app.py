from celery import Celery
import os

broker_url = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672//")
app = Celery("worker", broker=broker_url)
app.conf.task_serializer = "json"
app.conf.result_serializer = "json"
app.conf.task_acks_late = True
app.conf.task_reject_on_worker_lost = True

app.autodiscover_tasks(["app"])
