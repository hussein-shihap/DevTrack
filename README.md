DevTrack

DevTrack is a developer dashboard I built to keep GitHub repositories, activity, contributions, and favorite repositories in one place.

The project started as a way to practice building a complete full-stack application with a real external API, authentication, database persistence, and caching.

What it does

* Connects with GitHub and retrieves repository and activity data
* Shows GitHub contributions and recent activity
* Provides a dashboard for an overview of development activity
* Allows users to save repositories as favorites
* Supports regular authentication and Google OAuth
* Uses protected routes for authenticated areas
* Uses Redis for caching frequently requested data
* Stores application data in PostgreSQL

## Built with

**Frontend**

* React
* JavaScript
* Vite
* React Router
* Axios
* Context API

**Backend**

* Node.js
* Express.js
* REST API
* JWT
* Axios

**Database**

* PostgreSQL
* Redis

**Integrations**

* GitHub API
* Google OAuth

 Project structure

The backend is separated into different layers instead of putting the application logic directly inside the routes.

text
Backend/
└── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── repositories/
    ├── routes/
    ├── services/
    ├── utils/
    └── validators/
```

The general request flow is:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

When external data is needed, the service layer communicates with the corresponding API client.

This structure keeps the HTTP layer, business logic, and database operations separated and makes the backend easier to work with as the project grows.

## Frontend

The frontend is organized around pages, reusable components, API modules, authentication context, layouts, and protected routes.

text
Frontend/
└── Frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── layouts/
        ├── pages/
        └── routes/
```

API requests are kept inside the `api` layer rather than being spread throughout the UI components.

## Authentication

DevTrack supports two authentication flows:

* Email/password authentication with JWT
* Google OAuth

Authenticated pages are protected on the frontend, while the backend verifies authentication through middleware before handling protected requests.

## GitHub API

GitHub is the main external service used by DevTrack.

The application communicates with GitHub through a dedicated client and service layer rather than calling the API directly from controllers.

This keeps GitHub-specific logic isolated from the rest of the application.

## Caching

Redis is used as a caching layer for data that can be requested repeatedly.

The idea is to avoid unnecessary requests when the same data is already available in the cache, particularly when working with external GitHub data.

```text
Request
  ↓
Redis
  ├── Found → return cached data
  │
  └── Not found
          ↓
      GitHub API
          ↓
        Redis
          ↓
       Response
```

 Security

Some of the security measures implemented in the project include:

* JWT authentication
* Protected routes
* Request validation
* Rate limiting
* Centralized error handling
* Environment variables for sensitive configuration
* No credentials stored in the repository

Create your local environment files and provide the required database, Redis, JWT, GitHub, and Google OAuth configuration.

Do not commit `.env` files or real credentials.

 Running the project

Clone the repository:

```bash
git clone https://github.com/hussein-shihap/DevTrack.git
cd DevTrack
```

 Backend

```bash
cd Backend
npm install
npm run dev
```

 Frontend

Open another terminal:

```bash
cd Frontend/Frontend
npm install
npm run dev
```

Make sure PostgreSQL and Redis are available and that the required environment variables are configured before starting the application.

 Documentation

Additional project documentation and design materials are available in the `Docs` directory.

 Future improvements

Some things I would like to add or improve:

* More GitHub statistics
* More detailed repository insights
* Better activity filtering
* Automated testing
* CI/CD
* Production deployment
* Additional developer-tool integrations

Author

Hussein Shihap**

Full-Stack Software Developer

GitHub: https://github.com/hussein-shihap
