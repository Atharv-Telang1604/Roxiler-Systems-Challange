# Store Ratings Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `Backend` folder with:
```env
PORT=5000
DB_HOST=your-supabase-host
DB_PORT=5432
DB_USER=your-supabase-user
DB_PASSWORD=your-supabase-password
DB_NAME=your-supabase-database-name
JWT_SECRET=your-secret-key-here-make-it-long-and-random
```

### 3. Create Database Tables
Run the SQL script `schema.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "Run" to execute

Alternatively, you can run it via psql or any PostgreSQL client.

### 4. Start the Server
```bash
node server.js
```

The server will start on port 5000 (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/update-password` - Update password (requires auth)

### Admin (requires ADMIN role)
- `GET /api/admin/dashboard` - Get dashboard stats
- `POST /api/admin/stores` - Create a store
- `GET /api/admin/stores` - List stores with filters
- `POST /api/admin/users` - Create a user
- `GET /api/admin/users` - List users with filters
- `GET /api/admin/users/:id` - Get user details

### Stores (requires auth)
- `GET /api/stores` - List all stores (for normal users)

### Ratings (requires auth)
- `POST /api/ratings` - Submit/update a rating

### Owner (requires STORE_OWNER role)
- `GET /api/owner/dashboard` - Get owner dashboard

## Troubleshooting

### "Registration failed" error
1. Check that database tables are created (run `schema.sql`)
2. Verify your `.env` file has correct database credentials
3. Check the backend console for detailed error messages
4. Ensure Supabase database is accessible and running

### Database connection errors
- Verify all environment variables in `.env` are correct
- Check Supabase project is active
- Ensure database host, port, user, password, and database name are correct
