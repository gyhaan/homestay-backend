# Homestay Africa Backend

**Overview**

The Homestay Africa Backend is a Node.js server that powers the Homestay Africa platform. It handles user data, bookings, and communication between the frontend and the database, making your homestay experience seamless.

**Features**

* RESTful API to manage users, bookings, and hosts
* Integration with a MongoDB database for data storage
* Secure authentication and authorization
* Scalable architecture for future growth

**Prerequisites**

Before we begin, make sure you have these installed:

* Node.js (version 16 or later)
* npm (comes bundled with Node.js)

**Installation**

1. Clone the Repository:
   ```bash
   git clone [https://github.com/your-repo/homestay-backend.git](https://github.com/your-repo/homestay-backend.git)
   cd homestay-backend
   
Install Dependencies
npm install  
Starting the Application
Development Mode
Start the server in development mode:
npm run dev  
Production Mode
Run the server in production mode:
npm start

### Environment Variables

Create a .env file in the root directory and define the following variables:

NODE_ENV=development  
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
JWT_EXPIRES_IN=1d

### API Endpoints

User Authentication
POST /api/auth/register – Register a new user.
POST /api/auth/login – Log in a user and generate a token.
Bookings
GET /api/bookings – Retrieve all bookings.
POST /api/bookings – Create a new booking.
Hosts
GET /api/hosts – Retrieve all hosts.
POST /api/hosts – Add a new host.

### Technologies Used

Node.js: Backend runtime environment.
Express.js: Web framework for building RESTful APIs.
MongoDB: NoSQL database for storing application data.
Mongoose: ODM library for MongoDB.
JSON Web Tokens (JWT): For secure user authentication.
