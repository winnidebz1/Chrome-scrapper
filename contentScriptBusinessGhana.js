// ===========================
// CONTENT SCRIPT - BusinessGhana Scraper
// Scrapes BusinessGhana.com business directory
// ===========================

console.log('🇬🇭 Lead Finder Pro: BusinessGhana content script loaded');

// ===========================
// CONFIGURATION
// ===========================
const CONFIG = {
    selectors: {
        // Main business listing containers
        businessCard: '.business-listing, .company-item, .listing-item, article.business, .directory-item',
        businessList: '.business-directory, .listings, .companies-list',

        // Business details
        businessName: 'h2 a, h3 a, .business-name, .company-name, .listing-title a',
        category: '.category, .business-category, .industry, .sector',
        rating: '.rating, .stars',
        reviewCount: '.reviews, .review-count',
        address: '.address, .location, .business-address, .contact-address',
        phone: '.phone, .telephone, .contact-phone, a[href^="tel:"]',
        website: 'a.website, a[rel="nofollow"], a[target="_blank"]:not([href*="businessghana"])',
        email: 'a[href^="mailto:"], .email',

        // Alternative selectors
        altBusinessName: '.title a, h4 a, .name',
        altPhone: '.contact .phone, .tel',
        altAddress: '.contact .address, .addr',
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

function hasNoWebsite(card) {
    // Try to find website link
    const websiteElement = card.querySelector(CONFIG.selectors.website);

    if (!websiteElement) return true;

    const href = websiteElement.getAttribute('href') || '';
    const text = websiteElement.textContent?.trim().toLowerCase() || '';

    // Check for invalid indicators
    const noWebsiteIndicators = ['—', '-', 'n/a', 'not available', 'no website', ''];

    if (noWebsiteIndicators.includes(text)) return true;
    if (!href || href === '#' || href.startsWith('javascript:')) return true;
    if (href.includes('businessghana.com')) return true; // Internal link

    return false;
}

function isBusinessActive(businessData) {
    let criteriaCount = 0;

    if (businessData.phone && businessData.phone !== 'Not available') criteriaCount++;
    if (businessData.address && businessData.address !== 'Not available') criteriaCount++;
    if (businessData.email && businessData.email !== 'Not available') criteriaCount++;
    if (businessData.reviewCount && businessData.reviewCount >= CONFIG.activityThresholds.minReviews) {
        criteriaCount++;
    }

    return criteriaCount >= CONFIG.activityThresholds.minCriteria;
}

// ===========================
// SCRAPING FUNCTIONS
// ===========================

function extractBusinessData(card) {
    try {
        // Try multiple selectors for business name
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
        const category = extractText(categoryElement) || 'Business';

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
        let phone = extractText(phoneElement) || 'Not available';

        // Clean phone number
        if (phone.startsWith('tel:')) {
            phone = phone.replace('tel:', '').trim();
        }

        const addressElement = card.querySelector(CONFIG.selectors.address) ||
            card.querySelector(CONFIG.selectors.altAddress);
        const address = extractText(addressElement) || 'Not available';

        // Extract email
        const emailElement = card.querySelector(CONFIG.selectors.email);
        let email = extractText(emailElement) || 'Not available';
        if (email.startsWith('mailto:')) {
            email = email.replace('mailto:', '').trim();
        }

        // Check website status
        const hasWebsite = !hasNoWebsite(card);

        // Get BusinessGhana URL
        const linkElement = card.querySelector('a[href*="/business/"], a[href*="/company/"]') || nameElement;
        let businessGhanaUrl = window.location.href;
        if (linkElement) {
            const href = linkElement.getAttribute('href');
            if (href) {
                businessGhanaUrl = href.startsWith('http') ? href : 'https://www.businessghana.com' + href;
            }
        }

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
            mapsUrl: businessGhanaUrl,
            scrapedAt: new Date().toISOString(),
            source: 'BusinessGhana',
            email
        };

        businessData.isActive = isBusinessActive(businessData);
        businessData.activityStatus = businessData.isActive ? 'Active' : 'Low activity';

        scannedBusinesses.add(businessId);

        return businessData;

    } catch (error) {
        console.error('Error extracting BusinessGhana business data:', error);
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
        console.log('🇬🇭 Starting BusinessGhana scan...');

        // Try multiple selectors to find business cards
        let businessCards = document.querySelectorAll(CONFIG.selectors.businessCard);

        console.log(`📋 Found ${businessCards.length} BusinessGhana business listings`);

        if (businessCards.length === 0) {
            return {
                success: false,
                message: 'No business listings found. Make sure you are on a BusinessGhana directory page.',
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

        console.log(`✅ BusinessGhana scan complete! Found ${results.length} businesses`);

        return {
            success: true,
            count: results.length,
            leads: results,
            message: `Successfully scanned ${results.length} businesses from BusinessGhana`,
        };

    } catch (error) {
        console.error('❌ BusinessGhana scan error:', error);
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
    console.log('📨 BusinessGhana message received:', request.action);

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

console.log('✅ Lead Finder Pro: Ready to scan BusinessGhana! 🇬🇭');
