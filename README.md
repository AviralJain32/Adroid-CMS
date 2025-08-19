# 🧠 Adroid CMS – Conference Management System  
**[adroidcms.com](https://adroidcms.com)** | Built for **Adroid Connetz Private Limited**

> A powerful, scalable, full-stack Conference Management System enabling authors and organizers to seamlessly manage paper submissions, peer reviews, and virtual conferences.

---

## 🚀 Overview

Adroid CMS is an advanced, end-to-end platform developed to streamline the entire conference lifecycle—from creation and paper submission to review and event management. With over **2,000+ page views** and **100+ active user logins**, it’s designed to be performant under high load and intuitive for all stakeholders: Authors, Reviewers, and Organizers.

---

## 🌐 Live Site

🔗 [adroidcms.com](https://adroidcms.com)

---

## 🧩 Tech Stack

| Frontend            | Backend            | Auth & Payments        | State Management       | UI & Styling        | Other Optimizations       |
|---------------------|--------------------|-------------------------|-------------------------|----------------------|----------------------------|
| Next.js 14 (App Router) | Node.js + Express | NextAuth.js (JWT)       | RTK Query + Redux Toolkit | Tailwind CSS         | TanStack Table (v8)       |
| React Hook Form     | MongoDB (Mongoose) | Stripe Integration      | React Hot Toast         | ShadCN UI Components | Image Uploads (Cloudinary) |

---

## 🔄 System Flow

### 1. 🔐 Authentication
- Secure login/signup via **NextAuth.js** using **JWT strategy**.
- Role-based access: Admin, Author, Reviewer.

### 2. 📋 Conference Creation
- An **Author** logs in and creates a new conference via the dashboard.
- Conference details: Title, Description, Dates, Venue, etc.

### 3. ✅ Admin Verification
- Admins verify the conference via a dedicated **Admin Panel**.
- Once approved, a unique **Paper Submission Link** is generated and shared.

### 4. 📑 Paper Submission
- Authors share the submission link with prospective researchers.
- Researchers upload their papers along with metadata (title, abstract, keywords, etc.).

### 5. 👥 Reviewer Assignment
- Authors can assign multiple reviewers to submitted papers.
- Reviewers receive requests and can **accept/reject** them.
- Accepted reviewers can leave comments and feedback.

### 6. 💬 Comments & Decisions
- Reviewer comments are visible to authors.
- Organizers can make accept/reject decisions based on the reviews.

### 7. 💳 Payments (Optional)
- Stripe integration allows collecting submission or registration fees securely.

---

## 🧪 Performance Optimizations

- **📊 RTK Query**  
  → Efficiently fetches and caches backend data.  
  → Reduces redundant API/database calls by over **30%**.

- **📉 TanStack Table v8**  
  → Handles large tabular data with sorting, pagination, and virtualization.  
  → Optimized for high-traffic admin dashboards.

- **⚡ Next.js Optimizations**  
  → Static + dynamic rendering strategies.  
  → Improved TTFB and Core Web Vitals scores.

---

## 👨‍💻 Roles & Permissions

| Role     | Access                                                                 |
|----------|------------------------------------------------------------------------|
| Author   | Create/manage conferences, assign reviewers, view feedback            |
| Reviewer | Accept/reject requests, review assigned papers, leave comments        |

---

## 📦 Project Structure (Simplified)

```bash
adroid-cms/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Author & Admin dashboards
│   ├── auth/               # NextAuth setup
│   ├── conference/         # Conference details & paper submission
├── components/             # Reusable UI components (ShadCN/Tailwind)
├── lib/                    # Utility functions, Stripe, Auth
├── pages/api/              # API routes (Node.js + Express logic)
├── public/                 # Static files
├── models/                 # MongoDB/Mongoose schemas
└── styles/                 # Tailwind configurations
```

---

## 📌 Key Features

- ✅ JWT-based Authentication with Role Management  
- 📄 Dynamic Paper Submission Portal  
- 👥 Reviewer Workflow (Request → Accept → Review)  
- 💬 Real-time Feedback & Review Comments  
- 📊 Admin Dashboard with Analytics  
- 💸 Stripe-powered Payment System  
- 📁 Cloudinary-based File Uploads  
- 📉 Optimized for Scalability (RTK Query + TanStack Table)

---

## 🏗️ Built For

Developed exclusively for **Adroid Connetz Private Limited**, aligning with their vision of simplifying and automating complex event workflows.

---

## 📈 Stats & Reach

- 🌐 **2,000+ page views**
- 👤 **100+ active user logins**
- ⚡ **33.2% performance improvement** post optimization

---

## 📬 Contact

For queries, write to: **contact@adroidcms.com**  
Built and maintained by **Aviral Jain**.

---

## 📄 License

[MIT](./LICENSE)
"""
