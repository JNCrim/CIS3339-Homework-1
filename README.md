# CIS 3339 Homework 1 – Student Management System

## Project Overview

This project is a full-stack Student Management System migrated from plain HTML and JavaScript to Vue 3 using the Composition API. It uses Vue Router for navigation, Pinia for state management, Express for the backend REST API, and MongoDB for data storage.

The application supports student management, course management, enrollment management, duplicate prevention, cascading enrollment deletion, and course-specific enrollment filtering.

## Required Software

- Node.js 22.12 or later (use a supported LTS release)
- npm
- MongoDB Community Edition
- A modern web browser

## Environment Configuration

The required `.env` file is included in `cis3339-homework1/backend/`:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

The application uses a local MongoDB database. No cloud database, authentication credentials, or manual database initialization is required.

## Start MongoDB

Ensure MongoDB Community Edition is installed and running locally before starting the application.

On Windows, if MongoDB was installed as a service, open Services and start the MongoDB Server service. Alternatively, run the following command in an administrator terminal if the service is named MongoDB:

```bash
net start MongoDB
```

## Install and Build the Frontend

From the repository root, run:

```bash
cd frontend
npm install
npm run build
```

This generates the production frontend assets in the `frontend/dist` directory.

## Install and Start the Backend

From the frontend directory, run:

```bash
cd ../cis3339-homework1/backend
npm install
npm start
```

The backend automatically initializes the required MongoDB collections and indexes.

## Open the Application

Open the following address in a web browser:

http://localhost:3000

Express serves both the production Vue application and the backend API. A separate frontend development server is not required.

## Development Mode

With the backend running, open a separate terminal in the frontend directory and run:

```bash
npm run dev
```

Open http://localhost:5173 to access the development version of the application.