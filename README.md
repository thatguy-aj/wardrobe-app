Project for Software Engineering @ GSU Fall 2026

# Wardrobe Maker

**Software Engineering Project, Georgia State University, Fall 2026 (Team 10)**

Wardrobe Maker is a mobile app that gives users one place to catalog the clothes they own, build and save outfits, search for new pieces, share outfits with others, and get AI styling help.

## Team

| Member | Main responsibilities |
|---|---|
| O'Neal Madom Madom | Sprint 2 coordinator, requirements, user management, database integration |
| Andrew Jenkins | Problem statement, requirements, frontend development |
| Amaaz Lakhani | Backend development, database, API development |
| Ezekiel Babara | Activity diagrams, frontend development, testing |
| Japroz Singh Saini | Context diagram, database design, documentation |

Guide: Dr. Tushara Sadasivuni

## Tech stack

| Layer | Technology |
|---|---|
| Mobile frontend | React Native with Expo (TypeScript), React Navigation |
| Backend | Node.js with Express (JavaScript) |
| Database | MySQL 8 (MariaDB also works) |
| API style | REST, JSON, token-based sessions |
| Version control | Git and GitHub |

## Project status (Sprint 2)

| Feature | Status |
|---|---|
| User registration, login, logout, session handling (UC-01 to UC-03) | Working in the backend API |
| Account and profile management (UC-04) | Working in the backend API |
| Upload clothing, search and filter clothing (UC-05, UC-06) | Working in the backend API |
| Database schema (8 tables) | Created by `schema.sql` |
| Mobile screens for registration, login, and wardrobe | In progress |
| Favorites, outfits, sharing, AI Wardrobe Advice (UC-07 to UC-10) | Designed, planned for later sprints |

## Repository layout

```
wardrobe-app/
├── App.tsx, index.ts, app.json   Expo app entry and configuration
├── assets/                       App images and icons
├── package.json                  Frontend dependencies and scripts
├── setup.sh                      One-step install script
└── server/                       Backend
    ├── database/schema.sql       All table definitions
    ├── src/index.js              Express app
    ├── src/auth.js               Session creation and login checks
    ├── src/db.js                 MySQL connection pool
    ├── src/setupDb.js            Runs schema.sql (npm run db:setup)
    ├── src/routes/auth.js        Register, login, logout, account
    ├── src/routes/clothing.js    Clothing upload, search, delete
    └── .env.example              Database settings template
```

## How to compile and run

No IDE is needed. Everything runs from a terminal.

### 1. Prerequisites

- Node.js 18 or newer (`node -v`)
- MySQL 8 or MariaDB, installed and running
- Git

### 2. Get the code

```bash
git clone https://github.com/thatguy-aj/wardrobe-app.git
cd wardrobe-app
```

### 3. Install dependencies

Use the build script:

```bash
bash setup.sh
```

Or do it by hand:

```bash
npm install                  # frontend
cd server && npm install     # backend
```

### 4. Create a database account

Log in to MySQL as an admin (for example `sudo mysql` on Linux or `mysql -u root -p`) and run:

```sql
CREATE USER 'wardrobe'@'localhost' IDENTIFIED BY 'choose_a_password';
GRANT ALL PRIVILEGES ON wardrobe_maker.* TO 'wardrobe'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Configure the server

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set `DB_USER=wardrobe` and `DB_PASSWORD` to the password you chose. The `.env` file is ignored by Git and must never be committed.

### 6. Create the tables and start the API

```bash
npm run db:setup     # creates the wardrobe_maker database and 8 tables from database/schema.sql
npm start            # API on http://localhost:3000
```

Check it: open http://localhost:3000/api/health. It should show `{"status":"ok"}`.

### 7. Start the mobile app

In a second terminal, from the repository root:

```bash
npm start
```

Open the app with Expo Go on a phone or with an emulator from the Expo prompt. A phone cannot reach `localhost` on your computer, so when the screens call the API use your computer's local IP address, for example `http://192.168.1.20:3000/api`, with both devices on the same network.

## API reference

All requests and responses are JSON. Protected routes need the header `Authorization: Bearer <token>`, where the token comes from login.

| Method | Path | Description | Body or query |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | `first_name`, `last_name`, `email`, `password` (8+ characters), optional `date_of_birth` |
| POST | `/api/auth/login` | Log in, returns `token` | `email`, `password` |
| POST | `/api/auth/logout` | End the current session (protected) | none |
| GET | `/api/auth/me` | Account and profile (protected) | none |
| PUT | `/api/auth/me` | Update account or profile (protected) | any of `first_name`, `last_name`, `date_of_birth`, `height`, `clothing_size`, `preferences`, `profile_image` |
| POST | `/api/clothing` | Add a clothing item (protected) | `name`, `category` required; `color`, `size`, `brand`, `image_url` |
| GET | `/api/clothing` | List, search, filter your clothing (protected) | optional `q`, `category`, `color` |
| DELETE | `/api/clothing/:id` | Remove a clothing item (protected) | none |

### Quick test from the terminal

```bash
B=http://localhost:3000/api
H='Content-Type: application/json'

# Register, then log in and save the token
curl -s -X POST $B/auth/register -H "$H" -d '{"first_name":"Demo","last_name":"User","email":"demo@example.com","password":"password123"}'
TOKEN=$(curl -s -X POST $B/auth/login -H "$H" -d '{"email":"demo@example.com","password":"password123"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')

# Add and search clothing
curl -s -X POST $B/clothing -H "Authorization: Bearer $TOKEN" -H "$H" -d '{"name":"Blue Hoodie","category":"Tops","color":"blue"}'
curl -s "$B/clothing?q=hood" -H "Authorization: Bearer $TOKEN"

# Log out
curl -s -X POST $B/auth/logout -H "Authorization: Bearer $TOKEN"
```

## Database

MySQL with eight tables: `Users`, `User_Profile`, `Sessions`, `Clothing`, `Favorites`, `Outfits`, `Outfit_Items`, and `Shared_Outfits`. Primary and foreign keys are defined in `server/database/schema.sql`, and deleting a user removes their related rows.

## Security notes

- Passwords are stored as bcrypt hashes, never as plain text.
- Only a SHA-256 hash of each session token is stored in the `Sessions` table. Sessions expire after `SESSION_HOURS` (default 24) and are deleted at logout.
- Each user can only see and change their own clothing.

## Documentation

The full Sprint 2 report covers the revised problem statement, context and activity diagrams, use cases, requirements, use case diagram, database design, and screenshots.

## License

MIT. See [LICENSE](LICENSE).