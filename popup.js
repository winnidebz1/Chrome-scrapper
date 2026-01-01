// ===========================
// POPUP SCRIPT - UI Controller
// Manages the extension popup interface
// ===========================

console.log('🎨 Lead Finder Pro: Popup loaded');

// ===========================
// STATE
// ===========================
let allLeads = [];
let filteredLeads = [];

// ===========================
// DOM ELEMENTS
// ===========================
const elements = {
    scanBtn: document.getElementById('scanBtn'),
    exportBtn: document.getElementById('exportBtn'),
    copyBtn: document.getElementById('copyBtn'),
    clearResults: document.getElementById('clearResults'),
    clearFilters: document.getElementById('clearFilters'),

    filterNoWebsite: document.getElementById('filterNoWebsite'),
    filterHasPhone: document.getElementById('filterHasPhone'),
    filterActive: document.getElementById('filterActive'),
    minReviews: document.getElementById('minReviews'),

    totalLeads: document.getElementById('totalLeads'),
    resultsCount: document.getElementById('resultsCount'),
    resultsTable: document.getElementById('resultsTable'),
    statusMessage: document.getElementById('statusMessage'),
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
    elements.statusMessage.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.statusMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Update UI stats
 */
function updateStats() {
    elements.totalLeads.textContent = `${allLeads.length} Lead${allLeads.length !== 1 ? 's' : ''}`;
    elements.resultsCount.textContent = filteredLeads.length;

    // Enable/disable buttons based on results
    const hasResults = filteredLeads.length > 0;
    elements.exportBtn.disabled = !hasResults;
    elements.copyBtn.disabled = !hasResults;
    elements.clearResults.disabled = allLeads.length === 0;
}

/**
 * Apply filters to leads
 */
function applyFilters() {
    filteredLeads = allLeads.filter(lead => {
        // Filter: No Website Only
        if (elements.filterNoWebsite.checked && lead.hasWebsite) {
            return false;
        }

        // Filter: Has Phone
        if (elements.filterHasPhone.checked && (!lead.phone || lead.phone === 'Not available')) {
            return false;
        }

        // Filter: Active Only
        if (elements.filterActive.checked && !lead.isActive) {
            return false;
        }

        // Filter: Minimum Reviews
        const minReviews = parseInt(elements.minReviews.value) || 0;
        if (lead.reviewCount < minReviews) {
            return false;
        }

        return true;
    });

    renderResults();
    updateStats();
}

/**
 * Render results in the UI
 */
function renderResults() {
    if (filteredLeads.length === 0) {
        elements.resultsTable.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>${allLeads.length > 0 ? 'No leads match your filters' : 'No leads found yet'}</p>
        <small>${allLeads.length > 0 ? 'Try adjusting your filters' : 'Click "Scan Page" to start finding leads'}</small>
      </div>
    `;
        return;
    }

    // Render lead cards
    elements.resultsTable.innerHTML = filteredLeads.map(lead => `
    <div class="lead-card" data-id="${lead.id}">
      <div class="lead-header">
        <div class="lead-title">
          <div class="lead-name">${escapeHtml(lead.name)}</div>
          <div class="lead-category">${escapeHtml(lead.category)}</div>
        </div>
        <div class="lead-badges">
          ${!lead.hasWebsite ? '<span class="badge badge-success">No Website</span>' : ''}
          ${lead.isActive ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-warning">Low Activity</span>'}
        </div>
      </div>
      
      <div class="lead-details">
        ${lead.phone && lead.phone !== 'Not available' ? `
          <div class="detail-row">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92V19.92C22 20.4728 21.5523 20.9203 21 20.9203H18C8.05887 20.9203 0 12.8614 0 2.92029V0.920288C0 0.367502 0.447715 -0.0797119 1 -0.0797119H4C4.55228 -0.0797119 5 0.367502 5 0.920288V4.92029C5 5.47307 4.55228 5.92029 4 5.92029H3C3 12.5477 8.37258 17.9203 15 17.9203V16.9203C15 16.3675 15.4477 15.9203 16 15.9203H20C20.5523 15.9203 21 16.3675 21 16.9203Z" fill="currentColor"/>
            </svg>
            <span class="detail-value">${escapeHtml(lead.phone)}</span>
          </div>
        ` : ''}
        
        ${lead.address && lead.address !== 'Not available' ? `
          <div class="detail-row">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span class="detail-value">${escapeHtml(lead.address)}</span>
          </div>
        ` : ''}
        
        ${lead.rating ? `
          <div class="detail-row">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span class="detail-value">${lead.rating} ⭐ (${lead.reviewCount} reviews)</span>
          </div>
        ` : ''}
      </div>
      
      <div class="lead-footer">
        <button class="btn-small" onclick="openMapsUrl('${escapeHtml(lead.mapsUrl)}')">
          View on Maps
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Open Google Maps URL
 */
window.openMapsUrl = function (url) {
    chrome.tabs.create({ url });
};

/**
 * Export leads to CSV
 */
function exportToCSV() {
    if (filteredLeads.length === 0) {
        showStatus('No leads to export', 'error');
        return;
    }

    // CSV headers
    const headers = [
        'Business Name',
        'Category',
        'Phone',
        'Address',
        'Rating',
        'Reviews',
        'Website Status',
        'Activity Status',
        'Google Maps URL',
        'Scraped At'
    ];

    // CSV rows
    const rows = filteredLeads.map(lead => [
        lead.name,
        lead.category,
        lead.phone,
        lead.address,
        lead.rating || 'N/A',
        lead.reviewCount || 0,
        lead.websiteStatus,
        lead.activityStatus,
        lead.mapsUrl,
        lead.scrapedAt
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showStatus(`Exported ${filteredLeads.length} leads to CSV`, 'success');
}

/**
 * Copy leads to clipboard
 */
async function copyToClipboard() {
    if (filteredLeads.length === 0) {
        showStatus('No leads to copy', 'error');
        return;
    }

    const text = filteredLeads.map(lead =>
        `${lead.name}\n` +
        `Category: ${lead.category}\n` +
        `Phone: ${lead.phone}\n` +
        `Address: ${lead.address}\n` +
        `Rating: ${lead.rating || 'N/A'} (${lead.reviewCount || 0} reviews)\n` +
        `Website: ${lead.websiteStatus}\n` +
        `Status: ${lead.activityStatus}\n` +
        `Maps: ${lead.mapsUrl}\n` +
        `---`
    ).join('\n\n');

    try {
        await navigator.clipboard.writeText(text);
        showStatus(`Copied ${filteredLeads.length} leads to clipboard`, 'success');
    } catch (error) {
        showStatus('Failed to copy to clipboard', 'error');
    }
}

/**
 * Clear all results
 */
async function clearAllResults() {
    if (!confirm('Are you sure you want to clear all results?')) {
        return;
    }

    try {
        // Send message to content script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab) {
            chrome.tabs.sendMessage(tab.id, { action: 'clearResults' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError);
                }
            });
        }

        // Clear local storage
        await chrome.storage.local.remove(['leads', 'lastScan']);

        // Reset state
        allLeads = [];
        filteredLeads = [];

        renderResults();
        updateStats();

        showStatus('All results cleared', 'success');
    } catch (error) {
        console.error('Error clearing results:', error);
        showStatus('Failed to clear results', 'error');
    }
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    elements.filterNoWebsite.checked = true;
    elements.filterHasPhone.checked = false;
    elements.filterActive.checked = false;
    elements.minReviews.value = 0;

    applyFilters();
    showStatus('Filters cleared', 'info');
}

/**
 * Scan current page
 */
async function scanPage() {
    try {
        // Disable scan button
        elements.scanBtn.disabled = true;
        elements.scanBtn.innerHTML = `
      <div class="spinner"></div>
      Scanning...
    `;

        showStatus('Scanning page for businesses...', 'info');

        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            throw new Error('No active tab found');
        }

        // Check if on Google Maps
        if (!tab.url.includes('google.com/maps')) {
            throw new Error('Please navigate to Google Maps search results first');
        }

        // Send message to content script
        chrome.tabs.sendMessage(tab.id, { action: 'scanPage' }, (response) => {
            // Re-enable button
            elements.scanBtn.disabled = false;
            elements.scanBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Scan Page
      `;

            if (chrome.runtime.lastError) {
                showStatus('Error: ' + chrome.runtime.lastError.message, 'error');
                return;
            }

            if (response && response.success) {
                allLeads = response.leads || [];
                applyFilters();
                showStatus(response.message, 'success');
            } else {
                showStatus(response?.message || 'Scan failed', 'error');
            }
        });

    } catch (error) {
        console.error('Scan error:', error);
        showStatus(error.message, 'error');

        // Re-enable button
        elements.scanBtn.disabled = false;
        elements.scanBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Scan Page
    `;
    }
}

/**
 * Load saved results from storage
 */
async function loadSavedResults() {
    try {
        const data = await chrome.storage.local.get(['leads']);
        if (data.leads && data.leads.length > 0) {
            allLeads = data.leads;
            applyFilters();
            console.log(`📦 Loaded ${allLeads.length} saved leads`);
        }
    } catch (error) {
        console.error('Error loading saved results:', error);
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

elements.scanBtn.addEventListener('click', scanPage);
elements.exportBtn.addEventListener('click', exportToCSV);
elements.copyBtn.addEventListener('click', copyToClipboard);
elements.clearResults.addEventListener('click', clearAllResults);
elements.clearFilters.addEventListener('click', clearAllFilters);

// Filter change listeners
elements.filterNoWebsite.addEventListener('change', applyFilters);
elements.filterHasPhone.addEventListener('change', applyFilters);
elements.filterActive.addEventListener('change', applyFilters);
elements.minReviews.addEventListener('input', applyFilters);

// ===========================
// INITIALIZATION
// ===========================

// Load saved results on popup open
loadSavedResults();

console.log('✅ Lead Finder Pro: Popup ready!');
