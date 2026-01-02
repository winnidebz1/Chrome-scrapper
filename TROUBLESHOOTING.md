# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### Issue: "Please navigate to Google Maps search results first"

**Symptoms:**
- Error message appears when clicking "Scan Page"
- You ARE on Google Maps but still get the error

**Solutions:**

#### Solution 1: Refresh the Page
1. Press `F5` or `Ctrl+R` to refresh Google Maps
2. Wait for the page to fully load
3. Click the extension icon
4. Click "Scan Page" again

#### Solution 2: Reload the Extension
1. Go to `chrome://extensions/`
2. Find "Lead Finder Pro"
3. Click the **refresh icon** 🔄
4. Go back to Google Maps
5. Refresh the page (`F5`)
6. Try scanning again

#### Solution 3: Check the URL
Make sure you're on a URL that looks like:
```
✅ https://www.google.com/maps/search/restaurants+in+new+york
✅ https://www.google.com/maps/search/salons+near+me
✅ https://maps.google.com/maps?q=plumbers+chicago

❌ https://www.google.com/ (just Google homepage)
❌ https://www.google.com/maps (no search)
```

#### Solution 4: Check Console for Errors
1. Open Google Maps
2. Press `F12` to open DevTools
3. Click the **Console** tab
4. Look for errors in red
5. Check if you see: `🔍 Lead Finder Pro: Content script loaded`
   - ✅ If YES: Content script is working
   - ❌ If NO: Content script didn't load

**If content script didn't load:**
1. Reload the extension (chrome://extensions/)
2. Refresh Google Maps
3. Check console again

---

### Issue: No Results Found

**Symptoms:**
- Scan completes but shows "No businesses found"
- You can see businesses on Google Maps

**Solutions:**

#### Solution 1: Scroll Down First
1. On Google Maps, scroll down the business list
2. Let more businesses load
3. Then click "Scan Page"

#### Solution 2: Wait for Page to Load
1. After searching, wait 3-5 seconds
2. Make sure you see business listings on the left side
3. Then click "Scan Page"

#### Solution 3: Try a Different Search
Some searches work better than others:
```
✅ Good: "restaurants in new york"
✅ Good: "hair salons los angeles"
✅ Good: "plumbers near me"

❌ Poor: "businesses" (too vague)
❌ Poor: "apple" (brand name, all have websites)
```

#### Solution 4: Check the Selectors
Google Maps might have changed their HTML structure.

1. Open DevTools (`F12`)
2. Go to Console
3. Type: `document.querySelectorAll('div[role="article"]').length`
4. Press Enter
5. If it shows `0`, the selectors need updating

---

### Issue: Extension Icon Not Showing

**Symptoms:**
- Can't find the extension in toolbar
- Extension installed but not visible

**Solutions:**

#### Solution 1: Pin the Extension
1. Click the **puzzle icon** 🧩 in Chrome toolbar
2. Find "Lead Finder Pro"
3. Click the **pin icon** 📌

#### Solution 2: Check if Installed
1. Go to `chrome://extensions/`
2. Look for "Lead Finder Pro"
3. Make sure it's **enabled** (toggle should be blue)

---

### Issue: "Could not connect to page"

**Symptoms:**
- Error: "Could not connect to page. Please refresh Google Maps and try again."

**Solutions:**

#### Solution 1: Refresh Everything
1. Refresh Google Maps (`F5`)
2. Reload the extension (chrome://extensions/ → refresh icon)
3. Close and reopen the popup
4. Try again

#### Solution 2: Check Permissions
1. Go to `chrome://extensions/`
2. Click "Details" on Lead Finder Pro
3. Scroll to "Site access"
4. Make sure it says "On specific sites" or "On all sites"
5. Add `https://www.google.com/maps/*` if needed

---

### Issue: Scan Takes Too Long / Times Out

**Symptoms:**
- Spinner keeps spinning
- Eventually shows timeout error

**Solutions:**

#### Solution 1: Reduce Business Count
1. Try a more specific search (smaller area)
2. Scan fewer businesses at a time
3. The extension limits to 100 businesses per scan

#### Solution 2: Check Internet Connection
1. Make sure you have a stable connection
2. Google Maps needs to load fully
3. Try again when connection is better

---

### Issue: CSV Export Not Working

**Symptoms:**
- Click "Export CSV" but nothing downloads
- No file appears

**Solutions:**

#### Solution 1: Check Download Settings
1. Go to `chrome://settings/downloads`
2. Make sure "Ask where to save each file" is OFF
3. Or check your Downloads folder manually

#### Solution 2: Check Browser Permissions
1. Chrome might be blocking downloads
2. Look for a download icon in address bar
3. Click it and allow downloads

#### Solution 3: Try Copy Instead
1. Use the **copy icon** 📋 instead
2. Paste into a text file
3. Save as `.txt` or import to Excel manually

---

### Issue: Filters Not Working

**Symptoms:**
- Checking filters doesn't change results
- All businesses still showing

**Solutions:**

#### Solution 1: Check Filter Logic
- "No Website Only" ✅ = Shows ONLY businesses without websites
- "Has Phone" ✅ = Shows ONLY businesses with phone numbers
- Multiple filters = ALL must match (AND logic)

#### Solution 2: Clear Filters
1. Click "Clear All" button
2. Apply filters one at a time
3. Check results after each filter

---

### Issue: Extension Crashes / Freezes

**Symptoms:**
- Popup won't open
- Extension becomes unresponsive

**Solutions:**

#### Solution 1: Reload Extension
1. Go to `chrome://extensions/`
2. Click refresh icon on Lead Finder Pro
3. Try again

#### Solution 2: Clear Storage
1. Open popup
2. Click "Clear Results"
3. Close and reopen popup

#### Solution 3: Reinstall Extension
1. Go to `chrome://extensions/`
2. Remove Lead Finder Pro
3. Reload it from the folder

---

## Debugging Steps

### Step 1: Check Extension Installation
```
1. Go to chrome://extensions/
2. Find "Lead Finder Pro"
3. Verify:
   ✅ Enabled toggle is ON (blue)
   ✅ No errors shown
   ✅ Version shows 1.0.0
```

### Step 2: Check Content Script
```
1. Open Google Maps
2. Press F12 (DevTools)
3. Go to Console tab
4. Look for: "🔍 Lead Finder Pro: Content script loaded"
5. If missing, reload extension and refresh page
```

### Step 3: Check Popup Script
```
1. Open extension popup
2. Right-click popup → Inspect
3. Go to Console tab
4. Look for: "🎨 Lead Finder Pro: Popup loaded"
5. Check for any errors (red text)
```

### Step 4: Check Background Script
```
1. Go to chrome://extensions/
2. Find "Lead Finder Pro"
3. Click "Service Worker" link
4. Look for: "🚀 Lead Finder Pro: Background service worker loaded"
```

### Step 5: Test Message Passing
```
1. Open Google Maps
2. Open DevTools (F12)
3. In Console, type:
   chrome.runtime.sendMessage({action: 'test'})
4. Should not show errors
```

---

## Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "No active tab found" | Extension can't find current tab | Refresh page, try again |
| "Please navigate to Google Maps..." | Not on Google Maps | Go to maps.google.com |
| "Could not connect to page" | Content script not loaded | Refresh page, reload extension |
| "Scan timeout" | Taking too long | Try smaller search area |
| "No businesses found" | No listings detected | Check if businesses visible on page |

---

## Still Having Issues?

### Get Help:
1. **Check Console Logs**
   - Open DevTools (`F12`)
   - Copy any error messages
   - Include in bug report

2. **Report Bug on GitHub**
   - Go to: https://github.com/winnidebz1/Chrome-scrapper/issues
   - Click "New Issue"
   - Include:
     - Chrome version
     - Extension version
     - Steps to reproduce
     - Error messages
     - Screenshots

3. **Contact Support**
   - Email: support@leadfinderpro.com
   - Include debug information

---

## Quick Fixes Checklist

Before reporting a bug, try these:

- [ ] Refresh Google Maps page (`F5`)
- [ ] Reload extension (chrome://extensions/ → refresh)
- [ ] Close and reopen popup
- [ ] Try a different search query
- [ ] Check Chrome version (should be 88+)
- [ ] Disable other extensions temporarily
- [ ] Try in Incognito mode
- [ ] Clear browser cache
- [ ] Restart Chrome

---

## Known Limitations

1. **Maximum 100 businesses per scan** - This is intentional to prevent overload
2. **Rate limiting** - 500ms delay between each business
3. **Google Maps only** - Doesn't work on other sites
4. **Public data only** - Can't access private/restricted info
5. **Dynamic content** - Sometimes needs page refresh

---

## Performance Tips

### For Best Results:
1. ✅ Use specific search queries
2. ✅ Let page load fully before scanning
3. ✅ Scan one area at a time
4. ✅ Clear old results regularly
5. ✅ Use filters to narrow results

### Avoid:
1. ❌ Scanning immediately after search
2. ❌ Very broad search queries
3. ❌ Scanning while page is still loading
4. ❌ Multiple scans in quick succession
5. ❌ Keeping thousands of results in storage

---

**Updated:** January 2, 2026
**Version:** 1.0.0
