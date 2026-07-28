# Sri Vaari Traders — Simple User Guide

> **Read on your phone:** Open [`SIMPLE_USER_GUIDE.html`](SIMPLE_USER_GUIDE.html) in Chrome (Android) or Safari (iOS).  
> You can also share that file via WhatsApp, Google Drive, or email.

A plain-language guide for staff who manage the website day to day. No technical knowledge needed.

**Website:** https://srivari-ui.vercel.app  
**Admin login:** https://srivari-ui.vercel.app/admin/login

---

## 1. Logging in

1. Open the admin login link in your browser.
2. Enter your **email** and **password**.
3. Click **Login**.
4. You will land on the **Dashboard** (home screen of the admin area).

**First-time login (if no account was created for you yet):**

| Email | Password |
|-------|----------|
| admin@motors.com | Admin@123 |

> Change this password after your first login (go to **Profile** → Change Password).

---

## 2. What you see after login

### Left sidebar (menu)

This is your main navigation. Common items:

| Menu item | What it is for |
|-----------|----------------|
| **Dashboard** | Quick overview — numbers and charts |
| **Products** | Add and edit motors, pumps, and other items you sell |
| **Categories** | Groups like “Industrial Motors”, “Pumps”, etc. |
| **Industries** | Types of businesses you serve (textile, agriculture, etc.) |
| **Gallery** | Photos shown on the homepage |
| **Testimonials** | Customer reviews and success stories |
| **Hero Slider** | Big banner images/text at the top of the homepage |
| **Messages** | Contact form enquiries from visitors |
| **Quotes** | Price quote requests from visitors |
| **Settings** | Company phone, address, WhatsApp, social links |
| **Users** | Create accounts for other staff (Admin only) |
| **Audit Logs** | Record of who changed what (Admin only) |
| **Profile** | Your own name, photo, and password |

### Top bar

- **View Site** — Opens the public website in a new tab (what customers see).
- **Theme toggle** — Switch between light and dark screen.
- **Logout** — Sign out when you are done.

---

## 3. Daily tasks — quick reference

| I want to… | Go to… |
|------------|--------|
| See new customer messages | **Messages** |
| See new quote requests | **Quotes** |
| Add or edit a product | **Products** |
| Change company phone or address | **Settings** |
| Update homepage banner | **Hero Slider** |
| Add a customer review | **Testimonials** |
| Change my password | **Profile** |

---

## 4. How to handle customer messages

**Messages** = enquiries sent through the “Contact Us” form on the website.

1. Click **Messages** in the left menu.
2. Unread messages are easy to spot in the list.
3. Click a message to read the full details (name, email, phone, subject, message).
4. Reply to the customer by **email or phone** using the details shown — the website does not send replies automatically from this screen.
5. The message is marked as **read** when you open it.

---

## 5. How to handle quote requests

**Quotes** = when someone asks for a price on a specific product.

1. Click **Quotes** in the left menu.
2. Click a quote to see: customer name, email, phone, product name, quantity, and any notes.
3. Contact the customer by email or phone with your quote.
4. The quote is marked as **read** when you open it.

**Tip:** Visitors can also reach you via the green **WhatsApp** option on the website (Help button → Chat on WhatsApp).

---

## 6. How to add a new product

1. Go to **Products**.
2. Click **Add Product** (or similar button at the top).
3. Fill in the important fields:

| Field | What to enter |
|-------|----------------|
| **Name** | Product name (e.g. “5 HP Induction Motor”) |
| **Category** | Pick the right group |
| **Short description** | One or two lines for listings |
| **Description** | Full details for the product page |
| **Image** | Upload a photo or paste an image link |
| **Price** | Starting price in rupees (optional) |
| **Active** | Turn **ON** so customers can see it |
| **Featured** | Turn **ON** to highlight on the homepage (optional) |

4. Click **Save**.

**To add more photos for one product:** Open the product → use the **Images** / gallery section → upload photos → drag to reorder → set one as **Primary**.

---

## 7. How to edit or remove a product

**Edit**
1. Go to **Products**.
2. Find the product in the list.
3. Click **Edit**.
4. Change what you need and click **Save**.

**Remove from website (without deleting)**
- Turn **Active** to **OFF** and save. The product stays in admin but customers cannot see it.

**Delete permanently** (Admin only)
- Use the **Delete** button on the product. This cannot be undone.

---

## 8. How to manage categories

Categories appear on the homepage and help customers filter products.

1. Go to **Categories**.
2. **Add** — enter name, optional description and image.
3. **Reorder** — drag categories up or down to change the order on the site.
4. **Edit** — click a category to change its name or image.
5. **Active** — turn off to hide a category from the public site.

If no image is uploaded, the site shows the first letter of the category name instead.

---

## 9. How to update the homepage banner (Hero Slider)

1. Go to **Hero Slider**.
2. Each row is one slide on the homepage.
3. For each slide you can set:
   - **Title** — main headline
   - **Subtitle** — smaller line under the title
   - **Image** — background photo
   - **Button text & link** — e.g. “View Products” → links to products page
4. Use **Sort order** or drag to control which slide appears first.
5. Turn **Active** off to hide a slide without deleting it.

---

## 10. How to add a customer testimonial

1. Go to **Testimonials**.
2. Click **Add**.
3. Fill in:
   - Customer **name**, **company**, **job title**
   - Short **quote** and longer **story** (optional)
   - **Photo** (optional)
   - **Rating** (1 to 5 stars)
   - **Featured** — show on homepage
   - **Active** — show on the website
4. Click **Save**.

---

## 11. How to update company details

1. Go to **Settings**.
2. Scroll through the sections:

| Section | Examples |
|---------|----------|
| **Company Information** | Name, phone, email, address, working hours |
| **Statistics** | “25+ years”, “500+ clients” — homepage counters |
| **About** | Mission, vision, company history |
| **Social Media** | Facebook, LinkedIn, Instagram links |
| **Google Maps** | Map shown in the contact section |
| **WhatsApp & Chat** | WhatsApp number and default chat messages |

3. Click **Save All Settings** at the top when finished.

**WhatsApp settings (simple)**

| Setting | What it means |
|---------|----------------|
| `chat_widget_enabled` | `true` = Help button and WhatsApp work on the site |
| `whatsapp_phone` | Your WhatsApp number (numbers only, e.g. 919842231111) |
| `whatsapp_message_general` | Default message when someone chats from any page |
| `whatsapp_message_product` | Message on a product page — use `{productName}` where the product name should appear |

---

## 12. What customers see on the website

You do not need to build pages manually — the site updates when you save changes in admin.

| Page | What customers can do |
|------|------------------------|
| **Home** | See banner, categories, stats, about, industries, reviews, gallery, contact form |
| **Products** | Search and browse your catalog |
| **Product page** | See photos, specs, price, request a quote, download brochure |
| **Testimonials** | Read customer stories |
| **Contact** | Send a message or see your address on the map |
| **Help button** (bottom-right) | Browse products, request quote, WhatsApp, or call you |

---

## 13. Who can do what

Your account has one of three access levels:

| Role | Can do |
|------|--------|
| **Admin** | Everything — including delete, users, and audit logs |
| **Editor** | Add and edit products and content; view messages and quotes |
| **Viewer** | Look only — cannot change anything |

If you see **“Read Only”** on screen, you have Viewer access. Ask an Admin to upgrade your role if needed.

---

## 14. Good habits

1. **Check Messages and Quotes daily** — respond within 1–2 business days.
2. **Keep phone and WhatsApp correct** in Settings — customers use these to reach you.
3. **Use clear product photos** — good images get more enquiries.
4. **Turn off Active** instead of deleting — if you might list the product again later.
5. **Click View Site** after changes — confirm everything looks right on the live website.
6. **Log out** when using a shared computer.

---

## 15. Common problems

| Problem | What to try |
|---------|-------------|
| Cannot log in | Check email/password; ask Admin to reset your account |
| Changes not visible on website | Click Save; refresh the public site; check **Active** is ON |
| WhatsApp button missing | In Settings: `chat_widget_enabled` = `true` and phone number filled in |
| Uploaded image not showing | Wait a few seconds and save again; try a smaller image file |
| Forgot password | Ask an Admin user, or use **Profile** → Change Password if you can still log in |

---

## 16. Need more detail?

For a full technical reference (API, deployment, developers), see **[USER_MANUAL.md](USER_MANUAL.md)**.

For questions about your login or permissions, contact your **Admin** user.

---

*Sri Vaari Traders — Simple User Guide*
