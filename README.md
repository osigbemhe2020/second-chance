# Second Chance - Community Item Sharing Platform

Welcome to **Second Chance**, a web application designed to help community members share and donate gently used items that are looking for a new home.

This project is built using a microservices-inspired architecture with a Node.js/Express backend, a React frontend, a static site server, and a dedicated sentiment analysis service.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Features](#features)
4. [Installation & Local Setup](#installation--local-setup)
5. [Tech Stack](#tech-stack)
6. [Dependencies](#dependencies)
7. [API Endpoints](#api-endpoints)

---

## Overview

The **Second Chance** project is structured as follows:

*   **`secondChance-backend`**: The primary REST API server handling user authentication, product listings, data updates, and search operations, backed by MongoDB.
*   **`secondChance-frontend`**: A modern Single Page Application (SPA) built with React and Bootstrap, allowing users to browse items, search with various filters, register, log in, manage their profiles, and list new items.
*   **`secondchancewebsite`**: A production static file server that hosts the compiled production bundle of the React frontend.
*   **`sentiment`**: A microservice dedicated to performing natural language processing (NLP) to classify the sentiment score of text sentences.

---

## Prerequisites

Before running the application locally, ensure you have the following installed:

*   **Node.js** (v18.x or later recommended)
*   **npm** (Node Package Manager)
*   **MongoDB** (Ensure MongoDB Community Server is installed and running locally on port `27017` or have access to a MongoDB Atlas cluster)

---

## Features

*   **User Management**: Secure user registration and login with bcrypt password hashing and JWT (JSON Web Tokens) token-based authentication.
*   **Profile Editing**: Allow users to update their profile information.
*   **Item Listings**: Browse items available in the community, view complete item details, and check community comments.
*   **Seeding Data**: Automated database seeding tool to populate MongoDB with sample items.
*   **Item Contribution**: Registered users can upload new items with images (handled via Multer multipart form-upload).
*   **Advanced Search**: Filter items dynamically by keyword (case-insensitive partial matching), category, condition, and age (maximum years).
*   **Sentiment Service**: Separate service using the Natural NLP library to score user feedback and comments.

---

## Installation & Local Setup

Follow these steps to get all components up and running on your local machine:

### 1. Database Setup

Make sure your MongoDB server is running on `localhost:27017`.

Go to the `secondChance-backend` directory, create a `.env` file (you can copy `.env.sample`), and configure it. For a default local MongoDB setup:

```env
MONGO_URL=mongodb://localhost:27017
MONGO_DB=secondChance
MONGO_COLLECTION=secondChanceItems
JWT_SECRET=your_jwt_secret_here
```

To seed the database with initial sample data, run:

```bash
cd secondChance-backend
node util/import-mongo/index.js
```

### 2. Run Backend API Server

Start the Node backend in development mode (using nodemon):

```bash
cd secondChance-backend
npm run dev
```

The backend server will run on `http://localhost:3060`.

### 3. Run Sentiment Microservice

Configure the environment variables in `sentiment/.env` (optional, defaults to port `3000`), then start the service:

```bash
cd sentiment
npm start
```

The sentiment service will run on `http://localhost:3000`.

### 4. Run Frontend App (Development Mode)

Start the React development server:

```bash
cd secondChance-frontend
npm start
```

The frontend will be available at `http://localhost:3000`.

### 5. Production Build & Hosting (Optional)

To compile the React production build and serve it through the `secondchancewebsite` server:

1.  Build the frontend:
    ```bash
    cd secondChance-frontend
    npm run build
    ```
    *Note: The `postbuild` script automatically copies the build outputs to `secondchancewebsite/build`.*
2.  Start the static website server:
    ```bash
    cd secondchancewebsite
    node index.js
    ```
    The website will be hosted at `http://localhost:9000`.

---

## Tech Stack

*   **Frontend**: React (v18.x), React Router DOM (v6.x), Bootstrap (v5.x), HTML5, CSS3.
*   **Backend**: Node.js, Express (v4.x), MongoDB Native Driver.
*   **Microservices / NLP**: Natural library (PorterStemmer, AFINN sentiment dictionary).
*   **Logging**: Pino, Pino HTTP logger.

---

## Dependencies

Here are the key dependencies utilized in each project folder:

### Backend (`secondChance-backend/package.json`)
*   `express`: Web framework for handling routes and HTTP requests.
*   `mongodb`: Driver to interact with the MongoDB database.
*   `jsonwebtoken`: Generating and verifying auth tokens.
*   `bcryptjs`: Secure password hashing.
*   `multer`: Middleware for handling multipart/form-data (image uploads).
*   `pino` & `pino-http`: High-performance logging utilities.

### Frontend (`secondChance-frontend/package.json`)
*   `react` & `react-dom`: Component rendering and UI management.
*   `react-router-dom`: SPA page routing.
*   `bootstrap` & `react-bootstrap`: Styling and responsive layouts.
*   `react-datepicker`: Date picker UI component.

### Sentiment Analysis (`sentiment/package.json`)
*   `natural`: Natural Language Processing library.
*   `express`: Web server.
*   `pino`: Logger.

---

## API Endpoints

### 1. User Authentication (Backend)

| Method | Endpoint | Description | Request Headers / Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Body: `{ firstName, lastName, email, password }` |
| `POST` | `/api/auth/login` | Log in a user | Body: `{ email, password }` |
| `PUT` | `/api/auth/update` | Update user profile details | Headers: `Email`, `Authorization: Bearer <token>` <br> Body: `{ name }` or `{ firstName, lastName }` |

### 2. Item Listings (Backend)

| Method | Endpoint | Description | Request Headers / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/secondchance/items` | Fetch all second-chance items | None |
| `POST` | `/api/secondchance/items` | Create a new item listing | Body: `multipart/form-data` with keys: `file`, `name`, `category`, `condition`, `zipcode`, `age_days`, `description` |
| `GET` | `/api/secondchance/items/:id` | Fetch details of a single item | Path Parameter: `id` |
| `PUT` | `/api/secondchance/items/:id` | Update an existing item's details | Path Parameter: `id` <br> Body: `{ name, category, condition, age_days, description }` |
| `DELETE` | `/api/secondchance/items/:id` | Remove an item listing | Path Parameter: `id` |

### 3. Search Route (Backend)

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/secondchance/search` | Search items with custom filters | `name` (partial match), `category`, `condition`, `age_years` (less than or equal to) |

### 4. Sentiment Service

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `POST` | `/sentiment` | Perform sentiment analysis on a sentence | `sentence` (query parameter string) |