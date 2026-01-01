# 🧪 Testing Guide

## Manual Testing Checklist

### Pre-Installation Tests

- [ ] All files are present in the extension folder
- [ ] manifest.json is valid JSON
- [ ] All icon files exist (icon16.png, icon48.png, icon128.png)
- [ ] No syntax errors in JavaScript files

### Installation Tests

- [ ] Extension loads without errors in chrome://extensions/
- [ ] Extension icon appears in Chrome toolbar
- [ ] No error messages in extension card
- [ ] Extension can be pinned to toolbar

### Basic Functionality Tests

#### 1. Popup UI Tests
- [ ] Popup opens when clicking extension icon
- [ ] All UI elements are visible and properly styled
- [ ] Header displays correctly with gradient
- [ ] Buttons are clickable and styled
- [ ] Filters are visible and interactive
- [ ] Empty state shows when no results

#### 2. Google Maps Navigation Tests
- [ ] Navigate to https://www.google.com/maps
- [ ] Search for "Restaurants in New York"
- [ ] Verify search results appear
- [ ] Open extension popup
- [ ] Verify "Scan Page" button is enabled

#### 3. Scanning Tests
- [ ] Click "Scan Page" button
- [ ] Button shows loading state (spinner)
- [ ] Status message appears ("Scanning page...")
- [ ] Results appear after scan completes
- [ ] Success message shows with count
- [ ] Button returns to normal state

#### 4. Data Extraction Tests

Verify that extracted data includes:
- [ ] Business name is captured
- [ ] Category is captured
- [ ] Phone number is captured (when available)
- [ ] Address is captured
- [ ] Rating is captured (when available)
- [ ] Review count is captured
- [ ] Website status is correctly identified
- [ ] Google Maps URL is captured
- [ ] Activity status is calculated

#### 5. Filter Tests

**No Website Filter:**
- [ ] Check "No Website Only"
- [ ] Only businesses without websites are shown
- [ ] Uncheck filter
- [ ] All businesses are shown again

**Has Phone Filter:**
- [ ] Check "Has Phone Number"
- [ ] Only businesses with phone numbers are shown
- [ ] Uncheck filter
- [ ] All businesses are shown again

**Active Businesses Filter:**
- [ ] Check "Active Businesses Only"
- [ ] Only active businesses are shown
- [ ] Uncheck filter
- [ ] All businesses are shown again

**Minimum Reviews Filter:**
- [ ] Set minimum reviews to 5
- [ ] Only businesses with 5+ reviews are shown
- [ ] Set to 0
- [ ] All businesses are shown again

**Multiple Filters:**
- [ ] Enable multiple filters simultaneously
- [ ] Results are correctly filtered by all criteria
- [ ] Clear all filters
- [ ] All results are shown

#### 6. Export Tests

**CSV Export:**
- [ ] Click "Export CSV" button
- [ ] CSV file downloads automatically
- [ ] File name includes date (leads_YYYY-MM-DD.csv)
- [ ] Open CSV in Excel/Google Sheets
- [ ] All columns are present
- [ ] Data is correctly formatted
- [ ] Special characters are properly escaped

**Copy to Clipboard:**
- [ ] Click copy icon
- [ ] Success message appears
- [ ] Paste into text editor
- [ ] Data is formatted correctly
- [ ] All business information is included

#### 7. Clear Results Tests
- [ ] Click clear results button
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] All results are cleared
- [ ] Empty state is shown
- [ ] Total leads count resets to 0

#### 8. Persistence Tests
- [ ] Scan page and get results
- [ ] Close popup
- [ ] Reopen popup
- [ ] Previous results are still visible
- [ ] Clear results
- [ ] Close and reopen popup
- [ ] Results are gone (empty state)

### Advanced Tests

#### 9. Multiple Searches Tests
- [ ] Search for "Salons in Los Angeles"
- [ ] Scan page
- [ ] Note the results count
- [ ] Search for "Restaurants in Chicago"
- [ ] Scan page again
- [ ] New results are added/replaced correctly

#### 10. Edge Cases Tests

**No Results:**
- [ ] Search for a very specific query with few results
- [ ] Scan page
- [ ] Appropriate message is shown

**All Businesses Have Websites:**
- [ ] Search for "Apple Store"
- [ ] Scan page
- [ ] Enable "No Website Only" filter
- [ ] Empty state shows with appropriate message

**Large Result Set:**
- [ ] Search for "Restaurants in Manhattan"
- [ ] Scan page
- [ ] Extension handles large number of results
- [ ] No performance issues
- [ ] Respects 100 business limit

#### 11. Error Handling Tests

**Wrong Page:**
- [ ] Navigate to google.com (not Maps)
- [ ] Open extension
- [ ] Click "Scan Page"
- [ ] Appropriate error message is shown

**No Search Results:**
- [ ] Navigate to Google Maps (no search)
- [ ] Open extension
- [ ] Click "Scan Page"
- [ ] Appropriate error message is shown

#### 12. UI/UX Tests

**Visual Polish:**
- [ ] All animations are smooth
- [ ] Hover states work on buttons
- [ ] Active states work on buttons
- [ ] Checkboxes have custom styling
- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing is consistent

**Responsiveness:**
- [ ] Popup maintains 420px width
- [ ] Content doesn't overflow
- [ ] Scrolling works in results area
- [ ] All elements are accessible

**Accessibility:**
- [ ] Tab navigation works
- [ ] Focus states are visible
- [ ] Buttons have proper labels
- [ ] Icons have proper ARIA labels

### Performance Tests

#### 13. Speed Tests
- [ ] Popup opens in < 1 second
- [ ] Scan completes in < 10 seconds for 20 businesses
- [ ] Filters update instantly
- [ ] Export completes in < 2 seconds
- [ ] No lag when scrolling results

#### 14. Memory Tests
- [ ] Open Chrome Task Manager
- [ ] Note extension memory usage
- [ ] Perform multiple scans
- [ ] Memory usage stays reasonable (< 50MB)
- [ ] No memory leaks after clearing results

### Browser Compatibility Tests

#### 15. Chrome Tests
- [ ] Test on Chrome (latest version)
- [ ] All features work correctly

#### 16. Edge Tests (Optional)
- [ ] Test on Microsoft Edge
- [ ] All features work correctly

#### 17. Brave Tests (Optional)
- [ ] Test on Brave Browser
- [ ] All features work correctly

### Console Tests

#### 18. Content Script Console
- [ ] Open Google Maps
- [ ] Open DevTools (F12)
- [ ] Check Console tab
- [ ] Look for "Lead Finder Pro: Content script loaded"
- [ ] No error messages
- [ ] Scan page
- [ ] Look for extraction logs
- [ ] Verify data is being extracted

#### 19. Popup Console
- [ ] Open extension popup
- [ ] Right-click popup → Inspect
- [ ] Check Console tab
- [ ] Look for "Lead Finder Pro: Popup loaded"
- [ ] No error messages
- [ ] Perform actions
- [ ] Verify logs appear

#### 20. Background Console
- [ ] Go to chrome://extensions/
- [ ] Find "Lead Finder Pro"
- [ ] Click "Service Worker"
- [ ] Check Console tab
- [ ] Look for "Background service worker loaded"
- [ ] No error messages

### Security Tests

#### 21. Permissions Tests
- [ ] Extension only requests necessary permissions
- [ ] No excessive permissions requested
- [ ] Host permissions limited to Google Maps only

#### 22. Data Privacy Tests
- [ ] No data sent to external servers
- [ ] All processing happens locally
- [ ] No tracking or analytics
- [ ] Data stored only in Chrome local storage

### Real-World Usage Tests

#### 23. Lead Generation Workflow
- [ ] Search for target industry (e.g., "Salons in Accra")
- [ ] Scan page
- [ ] Apply "No Website Only" filter
- [ ] Apply "Has Phone Number" filter
- [ ] Set minimum reviews to 3
- [ ] Export qualified leads to CSV
- [ ] Open CSV and verify lead quality
- [ ] Use leads for outreach

#### 24. Multi-Session Test
- [ ] Day 1: Scan and save results
- [ ] Close browser
- [ ] Day 2: Reopen browser
- [ ] Open extension
- [ ] Verify results are still there
- [ ] Scan new results
- [ ] Export combined results

---

## Automated Testing (Future)

### Unit Tests (To Be Implemented)
```javascript
// Example test structure
describe('Business Data Extraction', () => {
  test('should extract business name', () => {
    // Test implementation
  });
  
  test('should detect missing website', () => {
    // Test implementation
  });
  
  test('should calculate activity status', () => {
    // Test implementation
  });
});
```

### Integration Tests (To Be Implemented)
- Test content script → popup communication
- Test storage read/write operations
- Test filter logic with various data sets

---

## Bug Reporting Template

When you find a bug, report it with:

```markdown
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [etc.]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Chrome Version: [e.g., 120.0.6099.109]
- Extension Version: [e.g., 1.0.0]
- Operating System: [e.g., Windows 11]

**Screenshots:**
[If applicable]

**Console Errors:**
[Copy any error messages from console]
```

---

## Test Results Template

```markdown
# Test Results - [Date]

**Tester:** [Your Name]
**Chrome Version:** [Version]
**Extension Version:** [Version]

## Summary
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Skipped: [X]

## Failed Tests
1. [Test Name] - [Reason]
2. [Test Name] - [Reason]

## Notes
[Any additional observations]
```

---

## Performance Benchmarks

Target benchmarks for the extension:

| Metric | Target | Actual |
|--------|--------|--------|
| Popup Load Time | < 1s | ___ |
| Scan 20 Businesses | < 10s | ___ |
| Filter Update | < 100ms | ___ |
| CSV Export | < 2s | ___ |
| Memory Usage | < 50MB | ___ |

---

**Happy Testing! 🧪**
