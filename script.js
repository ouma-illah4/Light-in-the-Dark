// --- Daily Scriptures ---
const scriptures = [
  "John 1:5 - The light shines in darkness, and the darkness has not overcome it.",
  "Psalm 34:18 - The LORD is close to the brokenhearted and saves those who are crushed in spirit.",
  "2 Corinthians 4:6 - For God, who said 'Let light shine out of darkness,' made his light shine in our hearts to give us the light of the knowledge of God's glory displayed in the face of Christ.",
  "Isaiah 41:10 - Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
  "Romans 8:38-39 - Nothing in all creation can separate us from the love of God that is in Christ Jesus our Lord.",
  "2 Corinthians 12:9 - 'My grace is sufficient for you, for my power is made perfect in weakness.'"
];

// --- Helper: pick daily scripture ---
function getDailyScripture() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return scriptures[dayOfYear % scriptures.length];
}

// --- Load blog posts (used on blog.html) ---
async function loadBlogPosts() {
  try {
    const response = await fetch("posts.json");
    const posts = await response.json();
    const blogContainer = document.getElementById("blog-posts");
    if (!blogContainer) return;

    posts.forEach(post => {
      const article = document.createElement("article");
      article.classList.add("blog-card");
      article.innerHTML = `
        <h3>${post.title}</h3>
        <time datetime="${post.date}">${new Date(post.date).toDateString()}</time>
        <p class="excerpt">${post.excerpt}</p>
        <p class="full-text" hidden>${post.fullText}</p>
        <button class="read-more">Read More</button>
      `;
      blogContainer.appendChild(article);
    });

    // Read-more toggle
    document.querySelectorAll(".read-more").forEach(button => {
      button.addEventListener("click", () => {
        const post = button.closest(".blog-card");
        const fullText = post.querySelector(".full-text");
        const isHidden = fullText.hidden;
        fullText.hidden = !isHidden;
        button.textContent = isHidden ? "Read Less" : "Read More";
      });
    });

    revealBlogCards();
  } catch (error) {
    console.error("Error loading blog posts:", error);
  }
}

// --- Blog Preview for Home Page (shows 2 latest posts) ---
async function loadBlogPreview() {
  try {
    const response = await fetch("posts.json");
    const posts = await response.json();
    const blogContainer = document.getElementById("blog-posts");
    if (!blogContainer) return;

    const latest = posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);

    latest.forEach(post => {
      const preview = document.createElement("article");
      preview.classList.add("blog-preview");
      preview.innerHTML = `
        <h3>${post.title}</h3>
        <time datetime="${post.date}">${new Date(post.date).toDateString()}</time>
        <p>${post.excerpt}</p>
      `;
      blogContainer.appendChild(preview);
    });

    const moreLink = document.createElement("a");
    moreLink.href = "blog.html";
    moreLink.classList.add("read-more-link");
    moreLink.textContent = "Read more reflections →";
    blogContainer.appendChild(moreLink);

    revealSections();
  } catch (error) {
    console.error("Error loading blog preview:", error);
  }
}

// --- Animation: Reveal blog cards ---
function revealBlogCards() {
  const cards = document.querySelectorAll(".blog-card");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach(card => observer.observe(card));
}

// --- Animation: Reveal sections (universal + fallback for short pages) ---
function revealSections() {
  const revealables = document.querySelectorAll("section, .card, article, .hero-text");

  // If the page is short or simple (like About or Tools), reveal all at once
  if (revealables.length < 10 || document.body.scrollHeight <= window.innerHeight + 200) {
    revealables.forEach(el => el.classList.add("show"));
    return;
  }

  // Otherwise, scroll-based reveal
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.15 }
  );

  revealables.forEach(section => observer.observe(section));
}

// --- Main Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  // Daily scripture
  const scriptureBox = document.getElementById("scripture-text");
  if (scriptureBox) scriptureBox.textContent = getDailyScripture();

  // Load proper content depending on the page
  const path = window.location.pathname;

  if (path.includes("blog.html")) {
    loadBlogPosts();
  } else if (path.includes("index.html") || path === "/" || path === "") {
    loadBlogPreview();
  } else {
    revealSections();
  }

  // --- Mobile Menu ---
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // --- Active Link Highlight on Scroll ---
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionTop = current.offsetTop - 120;
      const sectionHeight = current.offsetHeight;
      const sectionId = current.getAttribute("id");
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href").includes(sectionId)) {
            link.classList.add("active");
          }
        });
      }
    });
  });
});

// --- Transition div slide-in from right ---
const transitions = document.querySelectorAll(".transition");
const transObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
transitions.forEach(el => transObserver.observe(el));









