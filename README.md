# Wings Wiki

Globally Scalable Enterprise Wiki

# Getting Started

First, run ElasticSearch and create initial schema by using [init.ts](https://github.com/Vaduz/wings-wiki/blob/main/configs/es/init.ts).

Secondly, run the Next.js server:

```bash
# To run dev server:
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Enabling Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/home/dashboard) and a new create project.
2. Open hamburger menu, API & Services -> Credentials.
3. Create a new OAuth client ID.
4. Set Authorized redirect URIs: http://localhost:3000/api/auth/callback/google for development environment.
5. Set following environment variables for Next.js server displayed on credentials page:
   - `GOOGLE_CLIENT_ID`: Client ID
   - `GOOGLE_CLIENT_SECRET`: Client secret
   - `JWT_SECRET`: Random string

# Screen Shots

## Home Page
![home-page](https://github.com/Vaduz/wings-wiki/assets/69694/e916ceba-6b80-477d-9fdd-86cbc219083d)

## Space Home
![space-home](https://github.com/Vaduz/wings-wiki/assets/69694/590b27f0-fee9-41db-ab25-b34e2f98d8ae)

## Editing Page
![editing-page](https://github.com/Vaduz/wings-wiki/assets/69694/45c293cf-76f6-4b0e-9480-ffd0fcb8aeaf)

## New Space
![new-space](https://github.com/Vaduz/wings-wiki/assets/69694/15b6c569-ecdf-49b8-851a-bf1b66c07a41)

## New Document
![new-document](https://github.com/Vaduz/wings-wiki/assets/69694/b185d84d-4992-4d93-b302-155df32c2bbd)

## Search Page
![search-page](https://github.com/Vaduz/wings-wiki/assets/69694/591b78a6-1e2d-44d3-a0c7-e6674e2109de)

## Visited History
![visited-history](https://github.com/Vaduz/wings-wiki/assets/69694/b3fef955-7874-45a5-87fa-73c02c55b392)

## Edited History
![edited-history](https://github.com/Vaduz/wings-wiki/assets/69694/ab9e91bd-625f-4256-af3a-a5f150d8336b)
