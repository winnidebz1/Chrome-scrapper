# 🌐 Multi-Directory Support Guide

## Supported Business Directories

Lead Finder Pro now supports scraping from multiple business directories:

| Directory | Status | URL Pattern |
|-----------|--------|-------------|
| **Google Maps** | ✅ Active | `google.com/maps` |
| **Yelp** | ✅ Active | `yelp.com` |
| **Yellow Pages** | ✅ Active | `yellowpages.com` |
| **Facebook** | 🚧 Coming Soon | `facebook.com` |
| **LinkedIn** | 🚧 Coming Soon | `linkedin.com` |

---

## 🚀 How to Use

### Google Maps (Original)
```
1. Go to https://www.google.com/maps
2. Search: "restaurants in new york"
3. Click extension icon
4. Click "Scan Page"
```

### Yelp
```
1. Go to https://www.yelp.com
2. Search: "restaurants new york"
3. Click extension icon
4. Click "Scan Page"
```

### Yellow Pages
```
1. Go to https://www.yellowpages.com
2. Search: "restaurants new york"
3. Click extension icon
4. Click "Scan Page"
```

---

## 📊 What Gets Extracted

All directories extract the same core data:

- ✅ Business Name
- ✅ Category
- ✅ Phone Number
- ✅ Address
- ✅ Rating
- ✅ Review Count
- ✅ Website Status (Yes/No)
- ✅ Activity Status
- ✅ Source (Google Maps, Yelp, etc.)

---

## 🎯 Best Practices by Directory

### Google Maps
**Best For:**
- Local businesses
- Service-based businesses
- Restaurants & retail

**Search Tips:**
- Use specific locations: "salons in brooklyn"
- Include business type: "plumbers near me"
- Scroll down to load more results

### Yelp
**Best For:**
- Restaurants & food
- Entertainment venues
- Consumer services

**Search Tips:**
- Use Yelp's filters (price, rating, etc.)
- Sort by "Most Reviewed" or "Highest Rated"
- Check "Open Now" for active businesses

### Yellow Pages
**Best For:**
- Professional services
- B2B businesses
- Traditional businesses

**Search Tips:**
- Use category filters
- Search by city or ZIP code
- Look for "Verified" businesses

---

## 🔧 Technical Details

### How It Works

Each directory has its own content script:

```
contentScript.js          → Google Maps
contentScriptYelp.js      → Yelp
contentScriptYellowPages.js → Yellow Pages
```

The extension automatically:
1. **Detects** which site you're on
2. **Loads** the appropriate scraper
3. **Extracts** business data
4. **Stores** results in unified format

### Selectors by Directory

**Google Maps:**
- Business Card: `div[role="article"]`
- Name: `h2.fontHeadlineSmall`
- Website: `a[data-item-id*="authority"]`

**Yelp:**
- Business Card: `[data-testid="serp-ia-card"]`
- Name: `h3 a`
- Website: `a[href*="biz_redir"]`

**Yellow Pages:**
- Business Card: `.result`
- Name: `.business-name`
- Website: `a.track-visit-website`

---

## 🆕 Adding New Directories

Want to add support for another directory? Here's how:

### Step 1: Update manifest.json

Add the new site to `host_permissions` and `content_scripts`:

```json
{
  "host_permissions": [
    "https://www.newsite.com/*"
  ],
  "content_scripts": [
    {
      "matches": ["https://www.newsite.com/*"],
      "js": ["contentScriptNewSite.js"],
      "run_at": "document_idle"
    }
  ]
}
```

### Step 2: Create Content Script

Copy `contentScript.js` and modify the selectors:

```javascript
// contentScriptNewSite.js
const CONFIG = {
  selectors: {
    businessCard: '.business-listing',  // Update this
    businessName: '.name',              // Update this
    phone: '.phone-number',             // Update this
    // ... etc
  }
};
```

### Step 3: Update popup.js

Add the new site to the supported sites list:

```javascript
const supportedSites = [
  { name: 'New Site', pattern: 'newsite.com', example: 'https://www.newsite.com/search' }
];
```

### Step 4: Test

1. Reload extension
2. Navigate to new site
3. Click "Scan Page"
4. Check console for errors
5. Verify data extraction

---

## 🐛 Troubleshooting by Directory

### Google Maps Issues

**Problem:** No results found
**Solution:**
- Make sure you've searched for businesses
- Scroll down to load more listings
- Check if sidebar is visible

### Yelp Issues

**Problem:** Selectors not working
**Solution:**
- Yelp frequently updates their HTML
- Check browser console for errors
- Update selectors in `contentScriptYelp.js`

### Yellow Pages Issues

**Problem:** Website detection incorrect
**Solution:**
- Yellow Pages uses different website indicators
- Check the `hasNoWebsite()` function
- Verify website link selectors

---

## 📈 Comparison: Which Directory is Best?

| Feature | Google Maps | Yelp | Yellow Pages |
|---------|-------------|------|--------------|
| **Coverage** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Data Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **No-Website Rate** | High | Medium | High |
| **Best For** | Local services | Restaurants | B2B services |
| **Update Frequency** | High | High | Medium |

---

## 💡 Pro Tips

### Maximize Lead Quality

1. **Use Multiple Directories**
   - Scan same search on Google Maps AND Yelp
   - Cross-reference results
   - Find businesses listed on multiple platforms

2. **Filter Strategically**
   - Start with "No Website Only"
   - Add "Has Phone Number"
   - Set minimum reviews (3-5)

3. **Export & Deduplicate**
   - Export from each directory
   - Combine in Excel/Sheets
   - Remove duplicates by phone number

### Best Search Combinations

**For Restaurants:**
```
Google Maps: "restaurants [city]"
Yelp: "restaurants [neighborhood]"
Yellow Pages: "dining [city]"
```

**For Services:**
```
Google Maps: "plumbers near me"
Yelp: "plumbing services [city]"
Yellow Pages: "plumbers [zip code]"
```

**For Retail:**
```
Google Maps: "boutiques [area]"
Yelp: "shopping [neighborhood]"
Yellow Pages: "retail stores [city]"
```

---

## 🔮 Coming Soon

### Phase 2 Directories
- [ ] **Facebook Business Pages**
- [ ] **LinkedIn Company Pages**
- [ ] **Foursquare**
- [ ] **TripAdvisor**

### Phase 3 Features
- [ ] **Multi-directory scanning** (scan all at once)
- [ ] **Automatic deduplication**
- [ ] **Cross-platform matching**
- [ ] **Unified export** (all directories in one CSV)

---

## 📞 Support

**Issues with a specific directory?**
1. Check the troubleshooting section above
2. Open browser console (F12)
3. Look for error messages
4. Report on GitHub with:
   - Directory name
   - Search query used
   - Console errors
   - Screenshots

---

## 🎓 Developer Resources

### Selector Finding Tips

**Chrome DevTools:**
```
1. Right-click business listing
2. Select "Inspect"
3. Find unique selectors
4. Test with: document.querySelector('selector')
```

**Testing Selectors:**
```javascript
// In console
document.querySelectorAll('.business-card').length  // Count
document.querySelector('.business-name').textContent // Test
```

### Debugging Content Scripts

**Check if loaded:**
```javascript
// In page console
console.log('Content script loaded?')
// Should see message from content script
```

**Test message passing:**
```javascript
chrome.runtime.sendMessage({action: 'scanPage'}, console.log)
```

---

**Updated:** January 2, 2026
**Version:** 1.1.0
**Supported Directories:** 3 (Google Maps, Yelp, Yellow Pages)
