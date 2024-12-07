// Sample article data (replace with your own articles)
const articles = [
    {
        id: 1,
        title: 'Your Article Title',
        category: 'Technology', // Choose from: Technology, Science, Health, Business
        image: 'Lugo/your-image.jpg', // Put your image in the Lugo folder
        excerpt: 'Write a short description of your article here...',
        readTime: '5 min',
        date: '2024-01-15'
    },
    // Add more articles by copying the above format
    {
        id: 2,
        title: 'Another Article',
        category: 'Health',
        image: 'Lugo/another-image.jpg',
        excerpt: 'Another article description...',
        readTime: '3 min',
        date: '2024-01-16'
    }
];

// DOM Elements
const searchInput = document.querySelector('#searchInput');
const articlesContainer = document.querySelector('.articles-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.querySelector('.load-more');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Search Functionality
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterArticles(searchTerm);
}, 300));

function filterArticles(searchTerm) {
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm)
    );
    renderArticles(filteredArticles);
}

// Filter Buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (filter === 'all') {
            renderArticles(articles);
        } else {
            const filtered = articles.filter(article => 
                article.category.toLowerCase() === filter
            );
            renderArticles(filtered);
        }
    });
});

// Render Articles
function renderArticles(articlesList) {
    articlesContainer.innerHTML = articlesList.map(article => `
        <article class="article-card">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="article-content">
                <span class="category">${article.category}</span>
                <h2>${article.title}</h2>
                <p>${article.excerpt}</p>
                <div class="article-meta">
                    <span><i class="far fa-clock"></i> ${article.readTime}</span>
                    <span><i class="far fa-calendar"></i> ${formatDate(article.date)}</span>
                </div>
                <a href="#" class="read-more">Read More</a>
            </div>
        </article>
    `).join('');
}

// Newsletter Form
const newsletterForm = document.querySelector('#newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    // Add newsletter subscription logic here
    alert('Thank you for subscribing! Please check your email to confirm.');
    e.target.reset();
});

// Contact Form
const contactForm = document.querySelector('#contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add contact form submission logic here
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Heart Counter Functionality
let totalHearts = 0;
const heartCountDisplay = document.getElementById('heartCount');

function incrementHeart(button) {
    const countElement = button.querySelector('.heart-count');
    const heartIcon = button.querySelector('i');
    let count = parseInt(countElement.textContent);
    
    if (!button.classList.contains('active')) {
        count++;
        totalHearts++;
        button.classList.add('active');
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    } else {
        count--;
        totalHearts--;
        button.classList.remove('active');
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    }
    
    countElement.textContent = count;
    heartCountDisplay.textContent = totalHearts;
    
    // Add animation
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // Save to localStorage
    saveHeartState(button.closest('li').querySelector('h4').textContent, count);
}

function saveHeartState(articleTitle, count) {
    const hearts = JSON.parse(localStorage.getItem('articleHearts') || '{}');
    hearts[articleTitle] = count;
    localStorage.setItem('articleHearts', JSON.stringify(hearts));
}

// Load saved heart states
document.addEventListener('DOMContentLoaded', function() {
    const hearts = JSON.parse(localStorage.getItem('articleHearts') || '{}');
    let total = 0;
    
    document.querySelectorAll('.trending-list li').forEach(article => {
        const title = article.querySelector('h4').textContent;
        const button = article.querySelector('.heart-btn');
        const countElement = button.querySelector('.heart-count');
        const heartIcon = button.querySelector('i');
        
        if (hearts[title]) {
            countElement.textContent = hearts[title];
            total += hearts[title];
            if (hearts[title] > 0) {
                button.classList.add('active');
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
        }
    });
    
    totalHearts = total;
    heartCountDisplay.textContent = total;
});

// Fetch articles from the _posts folder
async function fetchArticles() {
    try {
        const response = await fetch('_posts/index.json');
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

// Display articles in the UI
function displayArticles(articles) {
    const articlesContainer = document.querySelector('.articles-container');
    
    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'article-card';
        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div class="article-content">
                <span class="category">${article.category}</span>
                <h2>${article.title}</h2>
                <p>${article.excerpt}</p>
                <span class="read-time">${article.readTime}</span>
            </div>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

// Load articles when page loads
document.addEventListener('DOMContentLoaded', fetchArticles);

// Initialize
renderArticles(articles);
