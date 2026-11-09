# StayBook — Travel Listing Platform

A full-stack travel listing application where users can explore destinations, create and manage travel listings, upload photos, and share reviews.

## Overview

StayBook is a travel listing platform built with **Node.js, Express.js, MongoDB, and EJS**. It provides user authentication, listing management, image uploads, location-based geocoding, search, category filtering, and reviews.

The project focuses on implementing practical backend concepts such as RESTful routing, middleware-based authorization, session management, data validation, and third-party service integration.

## Features

### Authentication & Authorization
- User registration, login, and logout using Passport.js.
- Secure password authentication with Passport Local Mongoose.
- Persistent sessions using Express Session and MongoDB.
- Protected routes for authenticated users.
- Ownership-based authorization for editing and deleting listings.
- Review-author authorization for deleting reviews.

### Listing Management
- Create, view, update, and delete travel listings.
- Upload multiple listing images.
- Store and manage images using Cloudinary.
- Remove existing images when updating or deleting listings.
- Validate listing data using Joi.

### Search & Discovery
- Search listings by title, location, and country.
- Search results ranked by relevance.
- Browse listings by categories such as Beaches, Mountains, Cabins, and Camping.
- Server-side pagination to improve listing navigation.

### Reviews
- Add reviews and ratings to listings.
- Associate reviews with their authors.
- Restrict review deletion to the review author.
- Automatically remove associated reviews when a listing is deleted.

### Location & Geospatial Data
- Integrate Mapbox Geocoding API to convert locations into geographic coordinates.
- Store location data using MongoDB GeoJSON Point objects.
- Maintain longitude and latitude coordinates for each listing.

### Error Handling
- Centralized Express error-handling middleware.
- Async error handling with a reusable `wrapAsync` utility.
- Joi-based server-side validation.
- Flash messages for user feedback.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML, CSS, Bootstrap, EJS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Passport.js, Passport Local Mongoose |
| Validation | Joi |
| Image Storage | Cloudinary, Multer |
| Geocoding | Mapbox Geocoding API |
| Sessions | Express Session, Connect-Mongo |
| Deployment | Render |

## Application Architecture

```text
Client
  |
  v
Express.js Application
  |
  +----------------------+
  |                      |
  v                      v
Authentication       Application Routes
(Passport.js)         |
                      +-- Listings
                      +-- Reviews
                      +-- Users
  |
  v
Middleware Layer
  |
  +-- Authentication checks
  +-- Ownership authorization
  +-- Joi validation
  +-- Async error handling
  |
  v
Controllers
  |
  +----------------+----------------+
  |                |                |
  v                v                v
MongoDB         Cloudinary         Mapbox
(Mongoose)      (Images)            (Geocoding)
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — version 22.20.0
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Cloudinary Account](https://cloudinary.com/)
- [Mapbox Account](https://www.mapbox.com/)

### 1. Clone the repository

```bash
git clone https://github.com/akfaizan/StayBook.git
cd StayBook
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_connection_string

SESSION_SECRET=your_session_secret
MONGO_SESSION_SECRET=your_mongo_session_secret

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_access_token
```

Replace the placeholder values with your own credentials.

**Important:** Never commit your `.env` file or expose API secrets in your repository.

### 4. Run the application

```bash
node app.js
```

Open your browser and visit:

```text
http://localhost:8080
```

## Project Structure

```text
StayBook/
│
├── controllers/       # Application logic
├── models/            # Mongoose schemas
├── routes/            # Express routes
├── views/             # EJS templates
├── public/            # Static assets and stylesheets
├── utils/             # Reusable utilities
├── init/              # Demo data and seeding script
│
├── app.js             # Application entry point
├── cloudConfig.js     # Cloudinary configuration
├── middleware.js      # Authentication and validation
├── schema.js          # Joi validation schemas
├── package.json
└── .env               # Environment variables (not committed)
```

## Key Technical Implementations

- **Session-based authentication:** Passport.js handles login and authentication, while Connect-Mongo stores sessions in MongoDB.
- **Authorization middleware:** Listing ownership and review authorship are checked before allowing protected operations.
- **Image management:** Multer handles uploads, while Cloudinary stores listing images and provides remote image URLs.
- **Geospatial representation:** Mapbox geocoding results are stored as GeoJSON Point coordinates in MongoDB.
- **Search and pagination:** Listing results support keyword matching, category filtering, relevance-based sorting, and paginated responses.
- **Data validation:** Joi validates incoming listing and review data before database operations.

## Future Improvements

- Add automated testing for routes and application logic.
- Improve search with advanced filters and sorting.
- Add map-based listing discovery.
- Improve loading states and overall responsive UI.
- Add more robust input sanitization and security checks.

## Author

**Md Faizan Akhtar**

B.Tech — Computer Science and Engineering (Data Science)

- GitHub: [@akfaizan](https://github.com/akfaizan)
- LinkedIn: [Md Faizan Akhtar](https://www.linkedin.com/in/faizan-akhtar-41b4a937b/)
- LeetCode: [logixfaizan](https://leetcode.com/u/logixfaizan/)

---

If you find this project useful, consider giving the repository a ⭐.
