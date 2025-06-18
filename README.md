# Ratings and Review System – FitPage Assignment

This project is built as part of the FitPage assessment. The goal is to create a full-stack web application where users can rate and review products. The application includes a fixed list of products on the frontend, and users can submit a rating, review, or both. Reviews also support image uploads and dynamic tag generation.

---

## Tech Stack

- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: Node.js + Express.js (REST APIs)
- **Database**: MySQL (via Sequelize ORM)
- **Image Uploads**: Cloudinary
- **Tagging**: NLP using `natural` and `stopword` libraries

---

## ER Diagram

![ER Diagram](https://github.com/user-attachments/assets/463f00e3-a95d-4998-bb51-255d3868898b)

---

## Setup Instructions

### Prerequisites

- Node.js
- MySQL
- npm / yarn
- Git

---

## Backend Setup

1. Go to `backend/` directory

2. Create a `.env` file with the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ratings_db
PORT=5000
Install dependencies and start server:


npm install
npm run dev
This will run the backend on http://localhost:5000

Frontend Setup
Go to frontend/ directory

Create a .env file:

env
Copy
Edit
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
Install dependencies and run the frontend:


npm install
npm run dev
App will be available at http://localhost:5173

How to Test
Go to the homepage

Select a product

Enter your name and email (used to identify users)

Give a rating (1-5) and/or review

Optionally upload an image

Submit

Note: The same user (by email) cannot review the same product twice.

Authentication
We haven’t implemented any authentication here. The user just enters a name and email and can post their review. This is sufficient for the current requirements.

Tags System
We have implemented real-time tag generation based on submitted reviews.
There is no separate schema or table for tags. Tags are generated using:

natural – for basic tokenization/stemming

stopword – to remove stopwords

This is processed on-the-fly when fetching reviews.

Image Uploads
Images can be uploaded while submitting reviews.
They are stored using Cloudinary and the image URL is saved with the review.