const API_URL = "/api/news";

const state = {
  category: "top",
  country: "in",
  query: "",
  nextPage: null,
  articles: [],
  loading: false
};

const els = {
  categoryRow: document.getElementById("categoryRow"),
  status: document.getElementById("statusArea"),
  featured: document.getElementById("featuredArea"),
  grid: document.getElementById("newsGrid"),
  heading: document.getElementById("feedHeading"),
  count: document.getElementById("resultCount"),
  loadMore: document.getElementById("loadMoreBtn"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  country: document.getElementById("countrySelect"),
  theme: document.getElementById("themeToggle"),
  menu: document.getElementById("menuToggle"),
  nav: document.querySelector(".desktop-nav")
};

const categoryNames = {
  top: "For you", technology: "Technology", business: "Business",
  science: "Science", health: "Health", sports: "Sports",
  entertainment: "Entertainment", politics: "Politics"
};

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("todayLabel").textContent =
  new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date()).toUpperCase();

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function safeImage(url) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "";
  } catch { return ""; }
}

function formatDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
}

function setLoading(isLoading) {
  state.loading = isLoading;
  els.loadMore.disabled = isLoading;
  els.loadMore.textContent = isLoading ? "Loading..." : "Load more stories ↓";
}

function showSkeletons() {
  els.status.innerHTML = "";
  els.featured.innerHTML = "";
  els.grid.innerHTML = Array.from({ length: 6 }, () => '<div class="skeleton skeleton-card"></div>').join("");
}

function showError(message) {
  els.status.innerHTML = `<div class="status-error">${escapeHTML(message)}</div>`;
  els.grid.innerHTML = '<div class="empty-state"><strong>We couldn’t load the headlines.</strong>Check your connection or API setup, then try again.</div>';
  els.featured.innerHTML = "";
  els.loadMore.hidden = true;
}

function imageMarkup(url, alt, className = "") {
  const src = safeImage(url);
  if (!src) return `<div class="${className} image-fallback">N</div>`;
  return `<img class="${className}" src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'image-fallback',textContent:'N'}))">`;
}

function articleCategory(article) {
  const category = Array.isArray(article.category) ? article.category[0] : article.category;
  return category || "Top stories";
}

function renderFeatured(articles) {
  if (!articles.length) { els.featured.innerHTML = ""; return; }
  const [main, ...rest] = articles;
  const side = rest.slice(0, 2);
  const card = (article, isMain) => {
    const title = escapeHTML(article.title || "Untitled story");
    const source = escapeHTML(article.source_name || article.source_id || "News source");
    const category = escapeHTML(articleCategory(article));
    const description = escapeHTML(article.description || "Open the original report to read more.");
    const image = safeImage(article.image_url);
    return `<a class="${isMain ? "hero-card" : "side-feature"}" href="${escapeHTML(article.link || "#")}" target="_blank" rel="noopener noreferrer">
      ${imageMarkup(image, title)}
      <div class="${isMain ? "hero-content" : "side-content"}">
        <span class="story-tag">${category}</span>
        <h${isMain ? "2" : "3"}>${title}</h${isMain ? "2" : "3"}>
        ${isMain ? `<p>${description}</p>` : ""}
        <div class="story-meta"><span>${source}</span><span>·</span><span>${formatDate(article.pubDate)}</span></div>
      </div></a>`;
  };
  els.featured.innerHTML = `${card(main, true)}<div class="side-stack">${side.map(item => card(item, false)).join("")}</div>`;
}

function renderGrid(articles) {
  if (!articles.length) {
    els.grid.innerHTML = '<div class="empty-state"><strong>No stories found</strong>Try another keyword or choose a different category.</div>';
    return;
  }
  els.grid.innerHTML = articles.map(article => {
    const title = escapeHTML(article.title || "Untitled story");
    const description = escapeHTML(article.description || "There is no summary available for this story. Visit the publisher to read the full report.");
    const source = escapeHTML(article.source_name || article.source_id || "News source");
    const category = escapeHTML(articleCategory(article));
    const url = escapeHTML(article.link || "#");
    return `<article class="news-card">
      <div class="card-image">${imageMarkup(article.image_url, title)}</div>
      <div class="card-body">
        <span class="card-category">${category}</span>
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="card-footer"><span class="source-name">${source}</span><span class="card-date">${formatDate(article.pubDate)}</span></div>
        <a class="read-link" href="${url}" target="_blank" rel="noopener noreferrer">Read full story <span>↗</span></a>
      </div></article>`;
  }).join("");
}

async function fetchNews({ append = false } = {}) {
  if (state.loading) return;
  setLoading(true);
  if (!append) showSkeletons();
  else els.status.textContent = "Loading more stories...";

  const params = new URLSearchParams({
    category: state.category,
    country: state.country
  });
  if (state.query) params.set("q", state.query);
  if (append && state.nextPage) params.set("page", state.nextPage);

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || data.status !== "success") throw new Error(data.message || "News request failed.");

    const incoming = data.results || [];
    state.articles = append ? [...state.articles, ...incoming] : incoming;
    state.nextPage = data.nextPage || null;

    const unique = [...new Map(state.articles.map(item => [item.article_id || item.link || item.title, item])).values()];
    state.articles = unique;
    els.status.innerHTML = "";
    els.heading.textContent = state.query ? `Results for “${state.query}”` : `${categoryNames[state.category] || "Latest"} stories`;
    els.count.textContent = `${data.totalResults || state.articles.length} stories found`;
    renderFeatured(state.articles.slice(0, 3));
    renderGrid(state.articles.slice(3));
    els.loadMore.hidden = !state.nextPage;
  } catch (error) {
    if (append) {
      els.status.innerHTML = `<div class="status-error">${escapeHTML(error.message)}</div>`;
    } else showError(error.message);
  } finally {
    setLoading(false);
  }
}

function selectCategory(category) {
  state.category = category;
  state.query = "";
  state.nextPage = null;
  els.searchInput.value = "";
  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle("selected", button.dataset.category === category);
    button.classList.toggle("active", button.classList.contains("nav-link") && button.dataset.category === category);
  });
  fetchNews();
}

els.categoryRow.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) selectCategory(button.dataset.category);
});

els.nav.addEventListener("click", event => {
  const link = event.target.closest("[data-category]");
  if (!link) return;
  event.preventDefault();
  selectCategory(link.dataset.category);
  els.nav.classList.remove("open");
});

els.searchForm.addEventListener("submit", event => {
  event.preventDefault();
  state.query = els.searchInput.value.trim();
  state.nextPage = null;
  fetchNews();
});

els.country.addEventListener("change", () => {
  state.country = els.country.value;
  state.nextPage = null;
  fetchNews();
});

els.loadMore.addEventListener("click", () => {
  if (state.nextPage) fetchNews({ append: true });
});

els.theme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  els.theme.textContent = dark ? "☀" : "☾";
  localStorage.setItem("newshub-theme", dark ? "dark" : "light");
});
if (localStorage.getItem("newshub-theme") === "dark") {
  document.body.classList.add("dark");
  els.theme.textContent = "☀";
}

els.menu.addEventListener("click", () => els.nav.classList.toggle("open"));

fetchNews();