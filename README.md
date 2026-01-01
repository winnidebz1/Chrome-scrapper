# 🎯 Lead Finder Pro - Chrome Extension

> **A production-ready Chrome extension for lead generation agencies to identify active businesses without websites on Google Maps.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Technical Details](#technical-details)
- [Project Structure](#project-structure)
- [Development](#development)
- [Publishing to Chrome Web Store](#publishing-to-chrome-web-store)
- [Compliance & Safety](#compliance--safety)
- [Roadmap](#roadmap)
- [Support](#support)

---

## 🌟 Overview

**Lead Finder Pro** is a powerful Chrome extension designed specifically for lead generation agencies and business development professionals. It automatically scans Google Maps business listings to identify active businesses that **do NOT have websites** - perfect opportunities for web design, digital marketing, and business consulting services.

### 🎯 Core Capabilities

- ✅ **Automated Scraping** - Extracts business data from Google Maps search results
- ✅ **Smart Detection** - Identifies businesses without websites
- ✅ **Activity Analysis** - Flags active businesses using multiple criteria
- ✅ **Advanced Filtering** - Filter by website status, phone availability, reviews, and activity
- ✅ **Easy Export** - Export leads to CSV or copy to clipboard
- ✅ **Privacy-First** - No external APIs, all processing happens locally

---

## ✨ Features

### 🔍 Intelligent Business Scraping

The extension automatically extracts:
- Business Name
- Category (e.g., Salon, Restaurant, Logistics)
- Phone Number
- Physical Address
- Rating & Review Count
- Website Status (Yes/No)
- Business Hours
- Google Maps URL
- Activity Status

### 🧠 Smart Activity Detection

A business is marked as **ACTIVE** if it meets **at least 2** of these criteria:
1. Has a visible phone number
2. Has business hours listed
3. Has at least 1 review
4. Has photos uploaded
5. Is marked "Open" or "Recently active"

### 🚫 Website Detection Logic

A business is flagged as **NO WEBSITE** if the website field:
- Is missing or empty
- Shows "—" or "-"
- Shows "Not available"
- Has an invalid/placeholder URL

### 🎨 Modern UI Features

- **Clean, Professional Design** - Premium SaaS-quality interface
- **Real-time Filtering** - Instantly filter results as you type
- **Responsive Layout** - Optimized for the extension popup
- **Visual Feedback** - Loading states, success/error messages
- **Smooth Animations** - Polished micro-interactions

### 📤 Export Options

- **CSV Export** - Download leads with all data fields
- **Copy to Clipboard** - Quick copy for pasting into other tools
- **Formatted Output** - Clean, readable format

---

## 🚀 Installation

### Option 1: Load Unpacked (Development)

1. **Download or Clone** this repository
   ```bash
   git clone https://github.com/yourusername/lead-finder-pro.git
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder (`Chrome scrapper`)

5. **Pin the Extension** (Optional)
   - Click the puzzle icon in Chrome toolbar
   - Pin "Lead Finder Pro" for easy access

### Option 2: Install from Chrome Web Store

*(Coming soon - after publishing)*

---

## 📖 How to Use

### Step 1: Navigate to Google Maps

1. Open [Google Maps](https://www.google.com/maps)
2. Search for businesses in your target area

**Example searches:**
- "Salons in Accra"
- "Restaurants in Kumasi"
- "Logistics companies Ghana"
- "Barbershops in Lagos"

### Step 2: Open the Extension

1. Click the **Lead Finder Pro** icon in your Chrome toolbar
2. The popup will open showing the control panel

### Step 3: Scan the Page

1. Click the **"Scan Page"** button
2. Wait while the extension extracts business data
3. Results will appear in the popup

### Step 4: Apply Filters

Use the built-in filters to refine your results:

- ✅ **No Website Only** - Show only businesses without websites
- ✅ **Has Phone Number** - Show only businesses with phone numbers
- ✅ **Active Businesses Only** - Show only active businesses
- 🔢 **Minimum Reviews** - Set a minimum review threshold

### Step 5: Export Your Leads

**Option A: Export to CSV**
- Click the **"Export CSV"** button
- File will download automatically
- Open in Excel, Google Sheets, or your CRM

**Option B: Copy to Clipboard**
- Click the copy icon
- Paste into any document or tool

---

## 🛠️ Technical Details

### Technology Stack

- **Manifest Version:** V3 (Latest Chrome Extension standard)
- **Languages:** JavaScript (ES6+), HTML5, CSS3
- **Storage:** Chrome Storage API (Local)
- **Scraping:** DOM manipulation (No external APIs)

### Permissions Required

```json
{
  "permissions": [
    "activeTab",      // Access current tab content
    "scripting",      // Inject content scripts
    "storage"         // Save leads locally
  ],
  "host_permissions": [
    "https://www.google.com/maps/*"  // Google Maps only
  ]
}
```

### Architecture

```
┌─────────────────┐
│   Popup UI      │ ← User Interface
│   (popup.js)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Content Script  │ ← Scraping Logic
│(contentScript.js)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Chrome Storage  │ ← Data Persistence
│   (Local API)   │
└─────────────────┘
```

### Key Components

1. **manifest.json** - Extension configuration
2. **popup.html/css/js** - User interface and controls
3. **contentScript.js** - DOM scraping and data extraction
4. **background.js** - Service worker for background tasks
5. **icons/** - Extension icons (16x16, 48x48, 128x128)

---

## 📁 Project Structure

```
Chrome scrapper/
├── manifest.json           # Extension configuration
├── popup.html              # Popup UI structure
├── popup.css               # Popup styling
├── popup.js                # Popup logic & controls
├── contentScript.js        # Google Maps scraper
├── background.js           # Background service worker
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

---

## 💻 Development

### Prerequisites

- Google Chrome (latest version)
- Basic knowledge of JavaScript
- Code editor (VS Code recommended)

### Local Development

1. **Make Changes**
   - Edit any `.js`, `.html`, or `.css` file
   
2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click the refresh icon on "Lead Finder Pro"
   
3. **Test Changes**
   - Navigate to Google Maps
   - Run a search and test the extension

### Debugging

**Content Script Debugging:**
```javascript
// Open DevTools on the Google Maps page
// Check Console for logs from contentScript.js
console.log('Debug info:', data);
```

**Popup Debugging:**
```javascript
// Right-click the extension popup
// Select "Inspect"
// Check Console for logs from popup.js
```

**Background Script Debugging:**
```javascript
// Go to chrome://extensions/
// Click "Service Worker" under the extension
// Check Console for logs from background.js
```

### Testing Checklist

- [ ] Extension loads without errors
- [ ] Scan button works on Google Maps
- [ ] Business data is extracted correctly
- [ ] Filters work as expected
- [ ] CSV export generates valid file
- [ ] Copy to clipboard works
- [ ] Clear results works
- [ ] UI is responsive and polished

---

## 🌐 Publishing to Chrome Web Store

### Preparation

1. **Create Developer Account**
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

2. **Prepare Assets**
   - Extension icons (already included)
   - Screenshots (1280x800 or 640x400)
   - Promotional images (440x280)
   - Detailed description

3. **Create Privacy Policy**
   - Required for Chrome Web Store
   - Host on your website
   - Include data collection practices

### Submission Steps

1. **Zip the Extension**
   ```bash
   # Exclude unnecessary files
   zip -r lead-finder-pro.zip . -x "*.git*" "*.md" "node_modules/*"
   ```

2. **Upload to Dashboard**
   - Go to Developer Dashboard
   - Click "New Item"
   - Upload the zip file

3. **Fill Out Listing**
   - Name: Lead Finder Pro
   - Description: (See marketing copy below)
   - Category: Productivity
   - Language: English

4. **Submit for Review**
   - Review can take 1-3 days
   - Address any feedback from Google

### Marketing Copy

**Short Description:**
```
Find active businesses without websites on Google Maps. Perfect for lead generation agencies.
```

**Detailed Description:**
```
Lead Finder Pro helps lead generation agencies and business development professionals identify high-quality leads on Google Maps.

KEY FEATURES:
✓ Scan Google Maps business listings
✓ Identify businesses without websites
✓ Detect active businesses automatically
✓ Advanced filtering options
✓ Export to CSV or clipboard
✓ 100% privacy-focused (no external APIs)

PERFECT FOR:
• Web design agencies
• Digital marketing consultants
• Business development professionals
• Lead generation agencies
• Sales teams

HOW IT WORKS:
1. Search for businesses on Google Maps
2. Click "Scan Page" in the extension
3. Filter results by website status, activity, reviews
4. Export qualified leads instantly

PRIVACY & COMPLIANCE:
• Scrapes only publicly visible data
• No login required
• No data sent to external servers
• All processing happens locally

Start finding qualified leads today!
```

---

## 🛡️ Compliance & Safety

### Data Privacy

- ✅ **No External APIs** - All scraping happens locally in the browser
- ✅ **No User Tracking** - We don't collect any user data
- ✅ **No Login Required** - Works without authentication
- ✅ **Local Storage Only** - Data stays on your device

### Ethical Scraping

- ✅ **Public Data Only** - Scrapes only publicly visible information
- ✅ **Rate Limiting** - Built-in delays to avoid overloading servers
- ✅ **User-Initiated** - Scraping only happens when user clicks "Scan"
- ✅ **No Background Scraping** - No automatic or hidden scraping

### Terms of Service Compliance

This extension:
- Does NOT bypass login walls
- Does NOT scrape private/restricted data
- Does NOT violate Google's Terms of Service
- Does NOT automate actions without user consent

**Disclaimer:** Users are responsible for how they use the scraped data. Always respect business privacy and comply with local data protection laws (GDPR, CCPA, etc.).

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅ (Current)
- [x] Google Maps scraping
- [x] Website detection
- [x] Activity analysis
- [x] CSV export
- [x] Basic filtering

### Phase 2: Enhanced Features 🚧 (Next)
- [ ] Instagram business page detection
- [ ] Email finder integration
- [ ] Lead scoring system
- [ ] Google Sheets export
- [ ] Bulk scanning (multiple pages)

### Phase 3: Advanced Features 🔮 (Future)
- [ ] CRM integration (HubSpot, Salesforce)
- [ ] Business directory scraping (Yelp, Yellow Pages)
- [ ] AI-powered lead qualification
- [ ] SaaS dashboard for team collaboration
- [ ] Automated outreach templates

### Phase 4: Monetization 💰 (Future)
- [ ] Free tier (50 leads/month)
- [ ] Pro tier ($29/month - unlimited)
- [ ] Agency tier ($99/month - team features)
- [ ] Chrome Web Store listing

---

## 🤝 Support

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/yourusername/lead-finder-pro/issues)
- **Email:** support@leadfinderpro.com
- **Documentation:** [Full Docs](https://leadfinderpro.com/docs)

### Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Bug Reports

When reporting bugs, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Built with ❤️ for lead generation professionals
- Inspired by the need for better prospecting tools
- Powered by Chrome Extension Manifest V3

---

## 📊 Stats

- **Lines of Code:** ~1,500
- **File Size:** < 100KB
- **Load Time:** < 1 second
- **Supported Browsers:** Chrome, Edge, Brave (Chromium-based)

---

**Made with 🚀 by Lead Generation Experts**

*Ready to find your next 1,000 leads?*

[Install Now](#installation) | [View Demo](#how-to-use) | [Get Support](#support)
