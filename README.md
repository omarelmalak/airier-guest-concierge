# Airier Guest Concierge

A full-stack application for managing guest concierge services, built with React (frontend) and Ruby on Rails (backend).

## Project Structure

```
airier-guest-concierge/
├── frontend/          # React + TypeScript + Vite frontend
└── backend/           # Ruby on Rails API backend
```

## Prerequisites

### Frontend Requirements
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** (package manager)

### Backend Requirements
- **Ruby** 3.3.1 - [Install with rbenv](https://github.com/rbenv/rbenv#installation) or [rvm](https://rvm.io/)
- **PostgreSQL** - [Install PostgreSQL](https://www.postgresql.org/download/)
- **Bundler** - `gem install bundler`

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
DATABASE_URL="postgresql://postgres:{PASSWORD}@db.qpzjdbthcmcihmejezos.supabase.co:5432/postgres"
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

## Environment Variables

### Backend
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/airier_guest_concierge_development
DATABASE_PASSWORD=password
```

### Frontend
Create a `.env` file in the `frontend/` directory if needed:
```env
SUPABASE_URL=
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
