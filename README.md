# 📰 NewsHub – Stay Updated, Stay Informed

A modern, responsive news web application that brings the latest headlines and stories together in one place. NewsHub allows users to explore news by category, search for specific topics, and browse news from different countries through a clean, editorial-style interface.

## 🌐 Live Demo

**[View Live Website](YOUR_DEPLOYED_WEBSITE_URL)**

## ✨ Features

- **Latest News:** Browse the latest available news from different countries.
- **Category Filtering:** Explore news across categories like Technology, Business, Sports, Entertainment, Health, Science and more.
- **Search Functionality:** Find articles using keywords.
- **Country Selection:** Switch between different country editions.
- **Featured Headlines:** Discover highlighted stories through an editorial-style layout.
- **Load More:** Browse additional articles with pagination.
- **Dark & Light Mode:** Switch themes with your preference saved in local storage.
- **Responsive Design:** Optimized for desktop, tablet and mobile devices.
- **Secure API Integration:** NewsData.io API key is handled on the server side.
- **Backend Protection:** Includes basic rate limiting and input validation.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Server and API routes |
| NewsData.io API | News data provider |
| dotenv | Environment variable management |

## 📸 Screenshots

_Add screenshots of your NewsHub homepage and other important sections here._

## ⚙️ Getting Started

Follow these steps to run NewsHub locally.

### Prerequisites

- Node.js 18 or newer
- npm
- NewsData.io API key

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/NewsHub.git
```

**2. Navigate to the project folder**

```bash
cd NewsHub
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory and add:

```env
NEWSDATA_API_KEY=your_api_key_here
PORT=3000
```

**5. Start the development server**

```bash
npm run dev
```

Or use:

```bash
npm start
```

**6. Open the application**

Visit:

http://localhost:3000

## 🔐 API & Security

NewsHub uses the NewsData.io API to retrieve news articles.

- API requests are handled through the Express backend.
- The API key is stored in environment variables.
- The API key is not exposed in frontend JavaScript.
- `.env` and `node_modules` are excluded from Git using `.gitignore`.

**Note:** Never upload your actual API key to GitHub. If a key has been exposed, regenerate it from your NewsData.io dashboard.

## 🚀 Deployment

NewsHub requires a Node.js-compatible hosting environment for its Express backend.

For deployment, configure:

- **Install Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variable:** `NEWSDATA_API_KEY`

You can use a Node.js hosting platform such as Render or Railway. Netlify deployment requires adapting the Express API to Netlify Functions or hosting the backend separately.

## 📁 Project Structure

```text
NewsHub/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## 📌 Important Notes

- News availability depends on the NewsData.io API plan and its usage limits.
- Article content and images are provided by the news API and their respective publishers.
- Clicking an article opens the original publisher's website.
- API availability, credits and data delays may vary depending on the provider's plan.

## 👩‍💻 Author

**Your Name**

- GitHub: [@YOUR-USERNAME](https://github.com/YOUR-USERNAME)

---

⭐ If you find this project useful, consider giving the repository a star!