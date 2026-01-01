// ===========================
// BACKGROUND SERVICE WORKER
// Handles extension lifecycle and background tasks
// ===========================

console.log('🚀 Lead Finder Pro: Background service worker loaded');

// ===========================
// INSTALLATION
// ===========================
chrome.runtime.onInstalled.addListener((details) => {
    console.log('📦 Extension installed:', details.reason);

    if (details.reason === 'install') {
        // First-time installation
        console.log('🎉 Welcome to Lead Finder Pro!');

        // Initialize storage
        chrome.storage.local.set({
            leads: [],
            settings: {
                autoScan: false,
                maxResults: 100,
            },
            stats: {
                totalScans: 0,
                totalLeads: 0,
            }
        });

        // Open welcome page (optional)
        // chrome.tabs.create({ url: 'welcome.html' });
    } else if (details.reason === 'update') {
        console.log('🔄 Extension updated');
    }
});

// ===========================
// MESSAGE HANDLING
// ===========================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Background received message:', request.action);

    switch (request.action) {
        case 'updateStats':
            updateStats(request.data).then(sendResponse);
            return true; // Async response

        case 'getStats':
            getStats().then(sendResponse);
            return true; // Async response

        default:
            sendResponse({ success: false, message: 'Unknown action' });
            return false;
    }
});

// ===========================
// STATISTICS TRACKING
// ===========================

/**
 * Update extension statistics
 */
async function updateStats(data) {
    try {
        const result = await chrome.storage.local.get(['stats']);
        const stats = result.stats || { totalScans: 0, totalLeads: 0 };

        if (data.scans) stats.totalScans += data.scans;
        if (data.leads) stats.totalLeads += data.leads;

        await chrome.storage.local.set({ stats });

        return { success: true, stats };
    } catch (error) {
        console.error('Error updating stats:', error);
        return { success: false };
    }
}

/**
 * Get extension statistics
 */
async function getStats() {
    try {
        const result = await chrome.storage.local.get(['stats']);
        return {
            success: true,
            stats: result.stats || { totalScans: 0, totalLeads: 0 }
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return {
            success: false,
            stats: { totalScans: 0, totalLeads: 0 }
        };
    }
}

// ===========================
// BADGE MANAGEMENT
// ===========================

/**
 * Update extension badge with lead count
 */
async function updateBadge() {
    try {
        const result = await chrome.storage.local.get(['leads']);
        const leads = result.leads || [];
        const count = leads.filter(lead => !lead.hasWebsite).length;

        if (count > 0) {
            chrome.action.setBadgeText({ text: String(count) });
            chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
        } else {
            chrome.action.setBadgeText({ text: '' });
        }
    } catch (error) {
        console.error('Error updating badge:', error);
    }
}

// Update badge when storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.leads) {
        updateBadge();
    }
});

// ===========================
// CONTEXT MENU (Optional)
// ===========================

// Create context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'scanCurrentPage',
        title: 'Scan this page for leads',
        contexts: ['page'],
        documentUrlPatterns: ['https://www.google.com/maps/*']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'scanCurrentPage') {
        // Send message to content script to start scan
        chrome.tabs.sendMessage(tab.id, { action: 'scanPage' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
            } else {
                console.log('Scan initiated from context menu');
            }
        });
    }
});

// ===========================
// ALARM FOR PERIODIC TASKS (Optional)
// ===========================

// Create alarm for periodic cleanup
chrome.alarms.create('cleanup', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        console.log('🧹 Running periodic cleanup...');
        // Could implement cleanup of old data here
    }
});

console.log('✅ Background service worker ready!');
