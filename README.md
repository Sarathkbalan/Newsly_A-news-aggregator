Newsly: Personalized News Aggregator App
Newsly is a web application that provides a personalized news experience by fetching, filtering, and displaying news articles based on user preferences. Users can search for news, and a proflie . Admin users can manage customnews articles

Features
User Authentication: Login and token-based authorization using JWT.
Personalized News Feed: Fetch articles tailored to user interests.
Search Functionality: Find articles quickly with a keyword search.
Profile: Admins and users have a profile .they can add , edit and delete Profile.
Admin Functionality: Admins can add , edit and delete customnews articles.
Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT (JSON Web Token)
Docker for containerization
Prerequisites
Ensure you have the following installed on your system:

Docker
Docker Compose
.env files
Create 2 .env files

.env in ui folder - content:
NEWS_API_KEY=Your NewsAPI Key

.env in server folder - content:
PORT=Your port SECRET_KEY=Your Secret Code NEWS_API_KEY=Your NewsAPI Key

docker compose up --build

App will start running here http://localhost:3000/

User Roles: Admin and User
Newsly supports two types of users:

Admin: Can manage news articles (add, edit, delete).
User: Can view, search, and have a profile (edit,delete).
How User Roles Work
During registration, users are assigned the User role by default.
The backend protects admin-only routes using role-based middleware.
The frontend dynamically adjusts features based on the user's role:
Admin Features:
Access to the "Add News" section.
Ability to edit or delete news articles.
User Features:
View, search, and Profile(edit,delete).
How to Test User Roles
Signup a User:
Signup without specifying the role, or explicitly set the role to "User".
User an Admin:
Use an admin role by modifying the backend request or directly adding it in the database.
Admin Access:
Log in as an admin and access the "Add News" section.
User Restrictions:
Log in as a User and verify that admin-only routes are inaccessible.
🎥 Project Demo
Watch the full working demo of Newsly on YouTube: Click Here
