# Airier Guest Concierge

A full-stack application for managing guest concierge services, built with React (frontend) and Ruby on Rails (backend).

## Project Structure

```
airier-guest-concierge/
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Ruby on Rails API backend
└── worker/            # Flask + Celery + Twilio SMS worker
```

## Prerequisites

### Frontend Requirements
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** (package manager)

### Backend Requirements
- **Ruby** 3.3.1 - [Install with rbenv](https://github.com/rbenv/rbenv#installation) or [rvm](https://rvm.io/)
- **PostgreSQL** - [Install PostgreSQL](https://www.postgresql.org/download/)
- **Bundler** - `gem install bundler`

### Worker Requirements
- **Python** 3.10+ (for Flask, Celery, Twilio client)
- **RabbitMQ** (Celery broker) - e.g. `brew install rabbitmq` then `brew services start rabbitmq`, or run via Docker

## Frontend Setup

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`.

## Backend Setup

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install Ruby dependencies
```bash
bundle install
```

### 3. Configure PostgreSQL database

Use the PostgreSQL database in Supabase and set the `DATABASE_URL` environment variable in the `.env` file in the `backend/` directory:

```bash
DATABASE_URL="postgresql://postgres:{password}@db.qpzjdbthcmcihmejezos.supabase.co:5432/postgres"
```

### 4. Start the Rails server
```bash
rails server
```

The backend API will be available at `http://localhost:3000`.

### Backend Scripts

- `rails server` or `rails s` - Start the development server
- `rails console` or `rails c` - Open Rails console
- `rails db:migrate` - Run database migrations
- `rails db:rollback` - Rollback last migration
- `rails db:seed` - Seed the database
- `bundle exec rspec` - Run tests

## Worker (Flask + Celery + Twilio SMS)

Internal Python service: Flask receives HTTP from Rails and enqueues Celery tasks; Celery consumes from RabbitMQ and calls Twilio.

### Worker Setup

1. Copy `worker/.env.example` to `worker/.env` and set:
   - `RABBITMQ_URL` – RabbitMQ broker URL (e.g. `amqp://guest:guest@localhost:5672//`)
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
2. Install dependencies via the Makefile:

   ```bash
   cd worker
   make install
   ```

3. Start RabbitMQ (e.g. `brew services start rabbitmq` or via Docker).

### Run worker (Flask + Celery together)

From the `worker` directory:

```bash
cd worker
make dev
```

This will:

- Create/activate `.venv` if needed
- Load environment variables from `.env`
- Start **Flask** on port `5000` (`FLASK_APP=app.flask_app flask run --port 5000`)
- Start **Celery** worker (`celery -A app.celery_app worker -l info`)

## Environment Variables

### Backend
Create a `.env` file in the `backend/` directory:
```env
# DATABASE_URL=postgresql://postgres:{password}@db.qpzjdbthcmcihmejezos.supabase.co:5432/postgres
# DATABASE_PASSWORD=password
# SUPABASE_JWT_SECRET=secret
# WORKER_API_URL=http://127.0.0.1:5000
```

### Frontend
Create a `.env` file in the `frontend/` directory if needed:
```env
# VITE_SUPABASE_URL=https://qpzjdbthcmcihmejezos.supabase.co
# VITE_SUPABASE_ANON_KEY=anon_key
# VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Worker
Create a `.env` file in the `worker/` directory:
```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672//
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...
```

## Troubleshooting

## Technologies Used

### Frontend
- **React** 18.3.1
- **TypeScript** 5.8.3
- **Vite** 5.4.19
- **Tailwind CSS** 3.4.17
- **shadcn/ui** - UI component library
- **React Router** 6.30.1

### Backend
- **Ruby** 3.3.1
- **Rails** 8.1.2
- **PostgreSQL** - Database
- **Puma** - Web server
- **RSpec** - Testing framework
