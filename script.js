/* ==========================================
   API URLS
   ========================================== */

// API for random quotes
const QUOTE_API = "https://dummyjson.com/quotes/random";

// Base URL for images
const IMAGE_BASE = "https://picsum.photos/id/";

/* ==========================================
   DOM REFERENCES
   ========================================== */

// Button element
const btn = document.getElementById("btn");

// Quote text
const quoteText = document.getElementById("quote-text");

// Quote author
const quoteAuthor = document.getElementById("quote-author");

// Background image
const photo = document.getElementById("photo");

// Spinner
const spinner = document.getElementById("spinner");

// Status element
const statusEl = document.getElementById("status");

// Card element
const card = document.getElementById("card");

/* ==========================================
   ERROR HANDLING
   ========================================== */

// Ensure elements exist before running code
if (!btn || !quoteText || !quoteAuthor || !photo || !spinner || !statusEl || !card) {
    throw new Error("DOM elements missing");
}

/* ==========================================
   HELPER FUNCTION: FETCH JSON
   ========================================== */

// Sends a fetch request and converts response to JSON
function fetchJSON(url) {
    return fetch(url)
        .then(response => {
            // Check if request succeeded
            if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
            }
            // Convert response body to JSON
            return response.json();
        });
}

/* ==========================================
   HELPER FUNCTION: RANDOM IMAGE
   ========================================== */

// Generates a random image URL
function randomImageUrl() {
    // Generate number between 1 and 100
    const id = Math.floor(Math.random() * 100) + 1;
    // Return full image URL
    return IMAGE_BASE + id + "/800/420";
}

/* ==========================================
   HELPER FUNCTION: LOAD IMAGE
   ========================================== */

// Wraps image loading inside a Promise
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Resolve when image loads
        img.onload = () => resolve(url);
        
        // Reject if image fails
        img.onerror = () => reject(new Error("Image failed to load"));
        
        // Start loading
        img.src = url;
    });
}

/* ==========================================
   BUTTON CLICK EVENT
   ========================================== */

btn.addEventListener("click", () => {
    // Generate random image
    const imageUrl = randomImageUrl();
    
    // Show loading spinner and hide card
    spinner.style.display = "flex";
    card.style.display = "none";
    statusEl.textContent = ""; // Clear any previous errors
    
    /*
    Promise.all runs multiple async operations
    at the same time
    */
    Promise.all([
        fetchJSON(QUOTE_API),
        loadImage(imageUrl)
    ])
    .then(results => {
        // Quote data
        const quoteData = results[0];
        
        // Image URL
        const imgUrl = results[1];
        
        // Update page content
        quoteText.textContent = quoteData.quote;
        quoteAuthor.textContent = "— " + (quoteData.author || "Unknown");
        
        // Display image
        photo.src = imgUrl;
        
        // Show the card
        card.style.display = "block";
    })
    .catch(err => {
        console.error("Error:", err);
        statusEl.textContent = "Failed to load quote. Please try again.";
        card.style.display = "none";
    })
    .finally(() => {
        // Hide spinner
        spinner.style.display = "none";
    });
});

// Generate a quote immediately when page loads
window.addEventListener("load", () => {
    btn.click();
});