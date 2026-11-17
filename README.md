# NewsHub 📰

A responsive, editorial-style news website built with HTML, CSS, JavaScript, Node.js and the NewsData.io API.

## Features

- Latest news feed for India (change country from the edition selector)
- Category filters and keyword search
- Featured headline layout and responsive news cards
- Load-more pagination
- Dark/light theme preference saved in local storage
- Secure server-side API key handling
- Basic API rate limiting and input validation

## Requirements

- Node.js 18 or newer
- A NewsData.io account and API key

## Run locally

1. Open this folder in VS Code.
2. Open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` and rename the copy to `.env`.
5. Put your NEWLY GENERATED API key in `.env`:

   ```env
   NEWSDATA_API_KEY=your_api_key_here
   PORT=3000
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

If `npm run dev` is not available in your Node version, use `npm start`.

## Important API notes

- The browser calls your own `/api/news` route. The NewsData.io key stays on the server.
- The free NewsData.io plan currently documents 200 credits/day, news data delayed by 12 hours, and up to 10 articles per page. Limits and terms can change; check the provider dashboard.
- The app displays article titles, summaries, source names and thumbnail images when returned. The full story opens on the original publisher's website. Respect publisher and provider image/content licensing terms.
- The backend currently requests English-language news and uses the `latest` endpoint.

## Deploying

Deploy this as a Node.js web service (for example, Render, Railway or another Node host that supports environment variables):

1. Push the project to GitHub **without `.env`**.
2. Create a web service from the repository.
3. Set the build/install command to `npm install`.
4. Set the start command to `npm start`.
5. Add `NEWSDATA_API_KEY` in the host's Environment Variables settings.
6. Deploy and open the URL provided by your host.

Do not put the API key in `public/script.js`, HTML, CSS, README, screenshots, or a public GitHub commit. If a key was already shared or committed, revoke/regenerate it in your NewsData.io dashboard.

## GitHub

```bash
git init
git add .
git commit -m "Build NewsHub news application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/NewsHub.git
git push -u origin main
```
