# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **PostgreSQL**: Download and install from [postgresql.org](https://www.postgresql.org/).

## Step 1: Database Setup

1.  Open pgAdmin or your preferred SQL tool.
2.  Create a new database named `invoicemaker`.
    ```sql
    CREATE DATABASE invoicemaker;
    ```

## Step 2: Backend Setup

1.  Navigate to the `backend` directory.
    ```bash
    cd backend
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5000
    DB_NAME=invoicemaker
    DB_USER=postgres
    DB_PASS=your_password
    DB_HOST=localhost
    JWT_SECRET=your_jwt_secret_key
    ```
    *Replace `your_password` with your actual PostgreSQL password.*

4.  Start the server.
    ```bash
    npm start
    ```
    *The server should run on http://localhost:5000 and automatically sync the database tables.*

## Step 3: Frontend Setup

1.  Navigate to the `frontend` directory.
    ```bash
    cd frontend
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  Start the development server.
    ```bash
    npm run dev
    ```
4.  Open your browser and go to `http://localhost:5173`.

## Step 4: First Login

1.  Go to the Register page (or use Postman to create the first user if UI registration is hidden).
2.  *Note: The current implementation allows public registration via `/login` -> Register (if implemented) or via API.*
3.  To register via API (Postman):
    - POST `http://localhost:5000/api/auth/register`
    - Body:
      ```json
      {
        "name": "Admin",
        "email": "admin@example.com",
        "password": "admin"
      }
      ```
4.  Login with these credentials on the frontend.
