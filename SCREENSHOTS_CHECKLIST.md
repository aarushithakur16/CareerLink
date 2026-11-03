# CareerLink - Screenshots Submission Checklist

Use this checklist to capture and organize the exact screenshots for your project demo and mentor presentation. The order follows the user journey from browsing to applying and administrative management.

---

### Demo Flow & Screenshot Order

| # | Screen Name | Route / URL | What to Capture & Highlight |
|---|---|---|---|
| **01** | **Home with Filters** | `http://localhost:5173/` | Hero section with unified search bar, popular domain quick pills, left sidebar with 16 domains, and initial list of 10 opportunity cards. |
| **02** | **Search Results** | `http://localhost:5173/?search=React` | Search query for `"React"` active, showing matching opportunities across roles and skills with search keyword in the bar. |
| **03** | **Empty State** | `http://localhost:5173/?search=c%2B%2B` | Search for `"c++"` showing safe regex handling, 0 results, and the friendly *"No opportunities found"* state with the *"Clear all filters"* button. |
| **04** | **Details Page with Similar Opportunities** | `http://localhost:5173/opportunity/<id>` | Full opportunity card with company avatar, role title, tags, spec grid (location, experience, salary, type, domain), skills chips, description, *"Apply on CareerLink"* button, and right-hand *"Similar Opportunities"* panel. |
| **05** | **Application Form with Validation Errors** | `http://localhost:5173/apply/<id>` | Clicking Submit on an empty form, showing inline error messages for required Full Name, Email, and 10-digit Phone. |
| **06** | **Filled Application Form** | `http://localhost:5173/apply/<id>` | Valid candidate information filled in (Name, valid email, 10-digit phone, message with character counter `X/1000`). |
| **07** | **Confirmation Page** | `http://localhost:5173/confirmation/<appId>` | Green checkmark icon, reference ID, candidate name, email, phone, applied opportunity title and company, plus navigation buttons. |
| **08** | **Duplicate Application Error** | `http://localhost:5173/apply/<id>` | Attempting to apply again with the same email to the same opportunity, displaying the red 409 conflict alert: *"Application Error: You have already applied for this opportunity with this email address"*. |
| **09** | **Admin Dashboard - Opportunities** | `http://localhost:5173/admin` | Active *"Opportunities (54)"* tab showing table of listings with company, domain, type, experience, salary, and Edit/Delete action buttons. |
| **10** | **Admin Add / Edit Modal** | `http://localhost:5173/admin` | The modal popup open with input fields, datalist for the 16 known domains, experience dropdown, and salary input. |
| **11** | **Toast Notification** | `http://localhost:5173/admin` | Green toast popup in bottom-right corner confirming *"Opportunity created successfully"* or *"Opportunity updated successfully"*. |
| **12** | **Admin Dashboard - Applications** | `http://localhost:5173/admin` | Active *"Candidate Applications (N)"* tab displaying applicant names, emails, phone numbers, applied roles, and dates. |
| **13** | **Filtered Applications by Opportunity** | `http://localhost:5173/admin` | Applications filtered using the dropdown for a specific opportunity. |
| **14** | **404 Not Found Page** | `http://localhost:5173/unknown-path` | Friendly 404 page showing the large 404 badge, *"Page Not Found"* heading, and *"Back to CareerLink Home"* button. |
| **15** | **Mobile View (375px Width)** | `http://localhost:5173/` | Mobile viewport (iPhone SE 375px) showing responsive navbar, vertical search bar, *"Filters"* collapsible button, responsive cards, and flex-wrapped pagination without horizontal scrolling. |

---

### Tips for Best Quality Screenshots
- Use full-page screenshots or high-DPI browser captures (e.g., Chrome/Edge DevTools Device Mode).
- Ensure both the backend and frontend dev servers are running during capture so live data is visible.
- Keep the browser window clean (close unnecessary tabs or developer consoles unless showing API responses).

