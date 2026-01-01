// ===========================
// CONTENT SCRIPT - Google Maps Scraper
// Runs on Google Maps pages to extract business data
// ===========================

console.log('🔍 Lead Finder Pro: Content script loaded');

// ===========================
// CONFIGURATION
// ===========================
const CONFIG = {
  selectors: {
    // Main business listing containers
    businessCard: 'div[role="article"]',
    businessList: 'div[role="feed"]',
    
    // Business details
    businessName: 'h2.fontHeadlineSmall, div.fontHeadlineSmall',
    category: 'button[jsaction*="category"]',
    rating: 'span[role="img"][aria-label*="star"]',
    reviewCount: 'span[aria-label*="review"]',
    address: 'button[data-item-id*="address"]',
    phone: 'button[data-item-id*="phone"]',
    website: 'a[data-item-id*="authority"]',
    hours: 'button[data-item-id*="oh"]',
    photos: 'button[jsaction*="photo"]',
    
    // Alternative selectors for detail panel
    detailName: 'h1.fontHeadlineLarge',
    detailCategory: 'button.DkEaL',
    detailRating: 'div.F7nice span[aria-hidden="true"]',
    detailReviewCount: 'div.F7nice button span',
    detailAddress: 'button[data-item-id="address"] div.fontBodyMedium',
    detailPhone: 'button[data-item-id*="phone:tel:"] div.fontBodyMedium',
    detailWebsite: 'a[data-item-id="authority"] div.fontBodyMedium',
    detailHours: 'button[data-item-id="oh"] div.fontBodyMedium',
  },
  
  // Activity detection thresholds
  activityThresholds: {
    minReviews: 1,
    minCriteria: 2, // At least 2 criteria must be met
  },
  
  // Rate limiting
  scrapeDelay: 500, // ms between scraping each business
  maxBusinesses: 100, // Maximum businesses to scrape per session
};

// ===========================
// STATE MANAGEMENT
// ===========================
let isScanning = false;
let scannedBusinesses = new Set();
let currentResults = [];

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Wait for a specified duration
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely extract text content from an element
 */
function extractText(element, selector) {
  if (!element) return null;
  
  const target = selector ? element.querySelector(selector) : element;
  if (!target) return null;
  
  return target.textContent?.trim() || null;
}

/**
 * Extract numeric value from text (e.g., "4.5 stars" -> 4.5)
 */
function extractNumber(text) {
  if (!text) return null;
  const match = text.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

/**
 * Check if website field indicates no website
 */
function hasNoWebsite(websiteElement) {
  if (!websiteElement) return true;
  
  const websiteText = websiteElement.textContent?.trim().toLowerCase() || '';
  const href = websiteElement.getAttribute('href') || '';
  
  // Check for common "no website" indicators
  const noWebsiteIndicators = [
    '—',
    '-',
    'not available',
    'no website',
    'n/a',
    ''
  ];
  
  // If text matches any indicator or href is empty/invalid
  return noWebsiteIndicators.some(indicator => websiteText === indicator) || 
         !href || 
         href === '#' || 
         href.startsWith('javascript:');
}

/**
 * Determine if a business is active based on multiple criteria
 */
function isBusinessActive(businessData) {
  let criteriaCount = 0;
  
  // Criterion 1: Has phone number
  if (businessData.phone) criteriaCount++;
  
  // Criterion 2: Has business hours
  if (businessData.hours) criteriaCount++;
  
  // Criterion 3: Has reviews
  if (businessData.reviewCount && businessData.reviewCount >= CONFIG.activityThresholds.minReviews) {
    criteriaCount++;
  }
  
  // Criterion 4: Has photos (we'll assume yes if we can see the business)
  // This is implicit in Google Maps listings
  criteriaCount++;
  
  // Criterion 5: Could check for "Open now" status
  if (businessData.hours && businessData.hours.toLowerCase().includes('open')) {
    criteriaCount++;
  }
  
  return criteriaCount >= CONFIG.activityThresholds.minCriteria;
}

/**
 * Extract business data from a listing card
 */
function extractBusinessData(card) {
  try {
    // Extract basic information
    const nameElement = card.querySelector(CONFIG.selectors.businessName);
    const name = extractText(nameElement);
    
    if (!name) return null; // Skip if no name found
    
    // Create unique ID from name and prevent duplicates
    const businessId = name.toLowerCase().replace(/\s+/g, '-');
    if (scannedBusinesses.has(businessId)) {
      return null; // Already scanned
    }
    
    // Extract category
    const categoryElement = card.querySelector(CONFIG.selectors.category);
    const category = extractText(categoryElement);
    
    // Extract rating and reviews
    const ratingElement = card.querySelector(CONFIG.selectors.rating);
    const ratingText = ratingElement?.getAttribute('aria-label') || '';
    const rating = extractNumber(ratingText);
    
    const reviewElement = card.querySelector(CONFIG.selectors.reviewCount);
    const reviewText = extractText(reviewElement) || '';
    const reviewCount = extractNumber(reviewText) || 0;
    
    // Extract contact information
    const phoneElement = card.querySelector(CONFIG.selectors.phone);
    const phone = extractText(phoneElement);
    
    const addressElement = card.querySelector(CONFIG.selectors.address);
    const address = extractText(addressElement);
    
    // Check website status
    const websiteElement = card.querySelector(CONFIG.selectors.website);
    const hasWebsite = !hasNoWebsite(websiteElement);
    
    // Extract business hours
    const hoursElement = card.querySelector(CONFIG.selectors.hours);
    const hours = extractText(hoursElement);
    
    // Get Google Maps URL
    const linkElement = card.querySelector('a[href*="maps"]');
    const mapsUrl = linkElement?.getAttribute('href') || window.location.href;
    
    // Construct business data object
    const businessData = {
      id: businessId,
      name,
      category: category || 'Unknown',
      rating,
      reviewCount,
      phone: phone || 'Not available',
      address: address || 'Not available',
      hasWebsite,
      websiteStatus: hasWebsite ? 'Yes' : 'No',
      hours: hours || 'Not available',
      mapsUrl,
      scrapedAt: new Date().toISOString(),
    };
    
    // Determine activity status
    businessData.isActive = isBusinessActive(businessData);
    businessData.activityStatus = businessData.isActive ? 'Active' : 'Low activity';
    
    // Mark as scanned
    scannedBusinesses.add(businessId);
    
    return businessData;
    
  } catch (error) {
    console.error('Error extracting business data:', error);
    return null;
  }
}

/**
 * Scan all visible business listings on the page
 */
async function scanBusinessListings() {
  if (isScanning) {
    console.log('⚠️ Scan already in progress');
    return { success: false, message: 'Scan already in progress' };
  }
  
  isScanning = true;
  const results = [];
  
  try {
    console.log('🔍 Starting scan...');
    
    // Find all business cards
    const businessCards = document.querySelectorAll(CONFIG.selectors.businessCard);
    console.log(`📋 Found ${businessCards.length} business listings`);
    
    if (businessCards.length === 0) {
      return {
        success: false,
        message: 'No business listings found. Make sure you are on a Google Maps search results page.',
      };
    }
    
    // Extract data from each card
    let processed = 0;
    for (const card of businessCards) {
      if (processed >= CONFIG.maxBusinesses) {
        console.log(`⚠️ Reached maximum limit of ${CONFIG.maxBusinesses} businesses`);
        break;
      }
      
      const businessData = extractBusinessData(card);
      
      if (businessData) {
        results.push(businessData);
        processed++;
        console.log(`✅ Extracted: ${businessData.name}`);
      }
      
      // Rate limiting
      await wait(CONFIG.scrapeDelay);
    }
    
    // Store results
    currentResults = results;
    
    // Save to Chrome storage
    await chrome.storage.local.set({ 
      leads: results,
      lastScan: new Date().toISOString(),
    });
    
    console.log(`✅ Scan complete! Found ${results.length} businesses`);
    
    return {
      success: true,
      count: results.length,
      leads: results,
      message: `Successfully scanned ${results.length} businesses`,
    };
    
  } catch (error) {
    console.error('❌ Scan error:', error);
    return {
      success: false,
      message: `Error during scan: ${error.message}`,
    };
  } finally {
    isScanning = false;
  }
}

/**
 * Get current scan results
 */
async function getResults() {
  try {
    const data = await chrome.storage.local.get(['leads']);
    return {
      success: true,
      leads: data.leads || [],
    };
  } catch (error) {
    console.error('Error getting results:', error);
    return {
      success: false,
      leads: [],
    };
  }
}

/**
 * Clear all results
 */
async function clearResults() {
  try {
    await chrome.storage.local.remove(['leads', 'lastScan']);
    currentResults = [];
    scannedBusinesses.clear();
    console.log('🗑️ Results cleared');
    return { success: true };
  } catch (error) {
    console.error('Error clearing results:', error);
    return { success: false };
  }
}

// ===========================
// MESSAGE LISTENER
// ===========================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Message received:', request.action);
  
  switch (request.action) {
    case 'scanPage':
      scanBusinessListings().then(sendResponse);
      return true; // Async response
      
    case 'getResults':
      getResults().then(sendResponse);
      return true; // Async response
      
    case 'clearResults':
      clearResults().then(sendResponse);
      return true; // Async response
      
    default:
      sendResponse({ success: false, message: 'Unknown action' });
      return false;
  }
});

// ===========================
// MUTATION OBSERVER
// For dynamically loaded content
// ===========================
const observer = new MutationObserver((mutations) => {
  // This can be used to detect when new listings are loaded
  // For now, we'll keep it simple and scan on demand
});

// Start observing the document
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log('✅ Lead Finder Pro: Ready to scan!');
