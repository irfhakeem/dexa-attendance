# Dexa Assessment Test - Muhammad Irfan Hakim

This repository contains results of the assessment test for fullstack developer candidates @ Dexa Group.

## Getting Started

To get started, clone this repository and follow the instructions below.

1. Clone this repository: `git clone <repository-url>`
2. Install dependencies for backend `npm install` & frontend `npm install`
3. Copy `.env.example` to `.env` on backend and frontend. Set the required environment variables.
4. Run migration `npx prisma migrate dev` and seeder `npx prisma db seed`
5. Run all needed infrastructure services in backend using docker `docker-compose up -d`
5. Open your browser and navigate to `http://localhost:3000`

## Acknowledgements

I used Generative AI (Gemini) for helped me integrate with 3rd party ORM prisma and made frontend boilerplate so i can continue with integrating FE with BE and edit some styles (save more time), also helped me fix some issues (my first time using nestJS).

## Approaches

Here's the explanation about all approaches that i took

### Backend

1. Directly receive raw blob from frontend but use presigned URL to upload to S3 and store the URL in the database
2. Like what mentioned in the requirements, i made HR as an admin-like user in this platform but view only in attendance records feature

### Frontend

1. Set all design system variables to make the UI consistent and easy to maintain
2. Used skeleton to improve user experience while waiting for data to load
3. Used debounce technique to prevent multiple requests while typing in search input (for 0.5s)
4. Used external components libraries (e.g. shadcn)
