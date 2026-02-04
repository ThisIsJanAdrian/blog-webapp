# Babblr: Basic Blog Website

**Babblr** is a simple full-stack blog application built with React (Vite + TypeScript) and Supabase, featuring user authentication, blog CRUD operations, comments with images, and pagination. Check it out [here](https://babblr.vercel.app/).

## Features
- User authentication (register, login, logout) using Supabase Auth
- Create, view, update, and delete blog posts
- Upload images for blog posts and comments
- View individual blog posts with a Reddit-style comment section
- Pagination for blog feed
- Responsive and minimal UI
- Protected actions (edit/delete only by post owner)

## Tech Stack
- Frontend: React, TypeScript, Vite
- Backend / BaaS: Supabase
- Routing: React Router
- Deployment: Vercel

## Environment Variables
Create a `.env.local` file in the project root:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run locally using:
```
npm install
npm run dev
```

Build for production using:
```
npm run build
```

## Deployment
The app is deployed using Vercel.
React Router rewrites are configured to support direct URL access.

## Credits
**Jan Adrian Manzanero** <br />
*Built as part of an assessment.*
