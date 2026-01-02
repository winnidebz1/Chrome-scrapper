// ===========================
// CONTENT SCRIPT - Yellow Pages Scraper
// Runs on Yellow Pages to extract business data
// ===========================

console.log('🔍 Lead Finder Pro: Yellow Pages content script loaded');

// ===========================
// CONFIGURATION
// ===========================
const CONFIG = {
    selectors: {
        // Main business listing containers
        businessCard: '.result',
        businessList: '.search-results',

        // Business details
        businessName: '.business-name',
        category: '.categories a',
        rating: '.result-rating',
        reviewCount: '.count',
        address: '.street-address',
        phone: '.phones',
        website: 'a.track-visit-website',

        // Alternative selectors
        altBusinessName: 'h2.n a',
        altPhone: '.phone',
    },

    // Activity detection thresholds
    activityThresholds: {
        minReviews: 1,
        minCriteria: 2,
    },

    // Rate limiting
    scrapeDelay: 500,
    maxBusinesses: 100,
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractText(element, selector) {
    if (!element) return null;
    const target = selector ? element.querySelector(selector) : element;
    if (!target) return null;
    return target.textContent?.trim() || null;
}

function extractNumber(text) {
    if (!text) return null;
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
}

function hasNoWebsite(websiteElement) {
    if (!websiteElement) return true;
    const href = websiteElement.getAttribute('href') || '';
    return !href || href === '#' || href.startsWith('javascript:');
}

function isBusinessActive(businessData) {
    let criteriaCount = 0;

    if (businessData.phone) criteriaCount++;
    if (businessData.reviewCount && businessData.reviewCount >= CONFIG.activityThresholds.minReviews) {
        criteriaCount++;
    }
    if (businessData.address && businessData.address !== 'Not available') criteriaCount++;

    return criteriaCount >= CONFIG.activityThresholds.minCriteria;
}

// ===========================
// SCRAPING FUNCTIONS
// ===========================

function extractBusinessData(card) {
    try {
        const nameElement = card.querySelector(CONFIG.selectors.businessName) ||
            card.querySelector(CONFIG.selectors.altBusinessName);
        const name = extractText(nameElement);

        if (!name) return null;

        const businessId = name.toLowerCase().replace(/\s+/g, '-');
        if (scannedBusinesses.has(businessId)) {
            return null;
        }

        // Extract category
        const categoryElement = card.querySelector(CONFIG.selectors.category);
        const category = extractText(categoryElement) || 'Unknown';

        // Extract rating and reviews
        const ratingElement = card.querySelector(CONFIG.selectors.rating);
        const ratingText = extractText(ratingElement) || '';
        const rating = extractNumber(ratingText);

        const reviewElement = card.querySelector(CONFIG.selectors.reviewCount);
        const reviewText = extractText(reviewElement) || '';
        const reviewCount = extractNumber(reviewText) || 0;

        // Extract contact information
        const phoneElement = card.querySelector(CONFIG.selectors.phone) ||
            card.querySelector(CONFIG.selectors.altPhone);
        const phone = extractText(phoneElement) || 'Not available';

        const addressElement = card.querySelector(CONFIG.selectors.address);
        const address = extractText(addressElement) || 'Not available';

        // Check website status
        const websiteElement = card.querySelector(CONFIG.selectors.website);
        const hasWebsite = !hasNoWebsite(websiteElement);

        // Get Yellow Pages URL
        const linkElement = card.querySelector('.business-name');
        const ypUrl = linkElement ? linkElement.getAttribute('href') : window.location.href;

        const businessData = {
            id: businessId,
            name,
            category,
            rating,
            reviewCount,
            phone,
            address,
            hasWebsite,
            websiteStatus: hasWebsite ? 'Yes' : 'No',
            hours: 'Not available',
            mapsUrl: ypUrl,
            scrapedAt: new Date().toISOString(),
            source: 'Yellow Pages'
        };

        businessData.isActive = isBusinessActive(businessData);
        businessData.activityStatus = businessData.isActive ? 'Active' : 'Low activity';

        scannedBusinesses.add(businessId);

        return businessData;

    } catch (error) {
        console.error('Error extracting Yellow Pages business data:', error);
        return null;
    }
}

async function scanBusinessListings() {
    if (isScanning) {
        console.log('⚠️ Scan already in progress');
        return { success: false, message: 'Scan already in progress' };
    }

    isScanning = true;
    const results = [];

    try {
        console.log('🔍 Starting Yellow Pages scan...');

        const businessCards = document.querySelectorAll(CONFIG.selectors.businessCard);
        console.log(`📋 Found ${businessCards.length} Yellow Pages business listings`);

        if (businessCards.length === 0) {
            return {
                success: false,
                message: 'No business listings found. Make sure you are on a Yellow Pages search results page.',
            };
        }

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

            await wait(CONFIG.scrapeDelay);
        }

        currentResults = results;

        await chrome.storage.local.set({
            leads: results,
            lastScan: new Date().toISOString(),
        });

        console.log(`✅ Yellow Pages scan complete! Found ${results.length} businesses`);

        return {
            success: true,
            count: results.length,
            leads: results,
            message: `Successfully scanned ${results.length} businesses from Yellow Pages`,
        };

    } catch (error) {
        console.error('❌ Yellow Pages scan error:', error);
        return {
            success: false,
            message: `Error during scan: ${error.message}`,
        };
    } finally {
        isScanning = false;
    }
}

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
    console.log('📨 Yellow Pages message received:', request.action);

    switch (request.action) {
        case 'scanPage':
            scanBusinessListings().then(sendResponse);
            return true;

        case 'getResults':
            getResults().then(sendResponse);
            return true;

        case 'clearResults':
            clearResults().then(sendResponse);
            return true;

        default:
            sendResponse({ success: false, message: 'Unknown action' });
            return false;
    }
});

console.log('✅ Lead Finder Pro: Ready to scan Yellow Pages!');
