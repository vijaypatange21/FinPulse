# 💹 FinPulse — AI-Powered Financial Health & Lending Platform

<div align="center">

**FinPulse** is a modern fintech web application that connects **borrowers** seeking loans with **lenders** managing portfolios. It features AI-driven health scores, real-time risk monitoring, smart recommendations, and a beautiful dark/light mode UI.

Built with **React 19** • **Vite 8** • **Tailwind CSS 4** • **React Router 7**

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Demo Login & Mock Data](#-demo-login--mock-data)
- [Features & Current Status](#-features--current-status)
- [Project Structure](#-project-structure)
- [How to Use the App](#-how-to-use-the-app)
- [Roadmap (Upcoming)](#-roadmap-upcoming)

---

## 🔍 Overview

FinPulse is a **frontend prototype** of a lending management platform. It demonstrates the core user flows for both **Borrowers** (people applying for loans) and **Lenders** (institutions reviewing and managing loans). 

> **⚠️ Important:** This is a frontend-only application with **no backend**. All data displayed is mock/static data hardcoded into the app. No real authentication, database, or API calls are made. The demo login simply routes you to the correct dashboard based on your email.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.x | UI library |
| **Vite** | 8.x | Build tool & dev server |
| **Tailwind CSS** | 4.2.x | Utility-first styling |
| **React Router DOM** | 7.13.x | Client-side routing |
| **Lucide React** | 0.577.x | Icon library |
| **Google Material Icons** | CDN | UI icons |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Installation & Run

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Demo Login & Mock Data

Since this is a **frontend-only prototype**, there is no real authentication system. The login page uses a simplified routing mechanism:

### How Login Works

The login form checks if the entered **email contains the word "lender"**:
- If **yes** → navigates to the **Lender Dashboard** (`/lender/dashboard`)
- If **no** → navigates to the **Borrower Dashboard** (`/borrower/dashboard`)

The password field accepts **any value** — no validation is performed.

### Quick Demo Buttons

The login page includes two **one-click demo buttons** for convenience:

| Button | Email Pre-filled | Password Pre-filled | Navigates To |
|---|---|---|---|
| **🧑 Borrower Demo** | `borrower@demo.com` | `password123` | Borrower Dashboard |
| **🏦 Lender Demo** | `lender@demo.com` | `password123` | Lender Dashboard |

> **Tip:** Click a demo button, then click **"Sign In"** to instantly access the respective dashboard.

### Mock Data

All data in the app is powered by a single mock data file at `src/data/mockData.js`. It contains:

| Data Set | Count | Used In |
|---|---|---|
| **`mockBorrowers`** | 5 borrowers | Lender → My Borrowers list & Borrower Monitoring pages |
| **`mockApplications`** | 5 applications | Lender → Loan Applications list & Application Detail pages |
| **`mockLenders`** | 10 lenders | Borrower → Find Lenders page |

Each borrower and application includes **detailed profile data** such as health scores, cash flow charts, repayment timelines, risk levels, and activity logs — all rendered dynamically on their respective detail pages.

---

## ✅ Features & Current Status

### ✅ Fully Working Features

These pages are fully built with interactive UI, mock data rendering, and navigation:

| Feature | Route | Description |
|---|---|---|
| **Landing Page** | `/` | Marketing homepage with hero section and feature highlights |
| **Role Selection** | `/role-selection` | Choose between Borrower or Lender registration |
| **Login Page** | `/login` | Authentication form with demo account buttons |
| **Borrower Dashboard** | `/borrower/dashboard` | Health score, income charts, loan eligibility, quick actions |
| **Lender Dashboard** | `/lender/dashboard` | Portfolio overview, risk alerts, recent applications table |
| **My Borrowers (List)** | `/lender/borrowers` | Full list of 5 borrowers with risk scores, status badges, and search |
| **Borrower Monitoring** | `/lender/borrowers/:id` | Detailed borrower profile with cash flow charts, EMI timeline, risk assessment |
| **Loan Applications (List)** | `/lender/applications` | All 5 loan applications with AI scores, filters, and status tracking |
| **Application Detail** | `/lender/applications/:id` | Deep-dive into an application with credit analysis, activity log, approve/reject |
| **Find Lenders** | `/borrower/find-lender` | Browse 10 lenders with ratings, interest rates, approval speed, and filters |
| **Recommendations** | `/recommendations` | AI-powered personalized loan recommendations for borrowers |
| **Document Upload** | `/borrower/upload` | Document upload interface for KYC and income proofs |
| **Lender Plans** | `/lender/plans` | Subscription/pricing plans for lenders |
| **Alert Detail** | `/lender/alerts/:id` | Detailed view of risk alerts and warnings |
| **Borrower Profile** | `/borrower/profile/:id` | Public-facing borrower profile card |
| **Dark/Light Mode** | All pages | Toggle between dark and light themes (toggle on every page) |

### 🚧 UI-Only / Placeholder Features

These elements are **visible in the sidebar or UI** but link to `#` or have no dedicated functional page yet:

| Feature | Location | Status |
|---|---|---|
| **My Health Score** | Borrower sidebar | Links to `#` — no dedicated page |
| **Loans** | Borrower sidebar | Links to `#` — no dedicated page |
| **Transactions / Analytics** | Borrower sidebar | Links to `#` — no dedicated page |
| **Settings** | Borrower sidebar | Links to `#` — no dedicated page |
| **Portfolio** | Lender sidebar | Links to `#` — no dedicated page |
| **Forgot Password** | Login page | Links to `#` — non-functional |
| **Google / LinkedIn Login** | Login page | Buttons present, no OAuth integration |
| **Export CSV / Bulk Approve** | Lender Dashboard | Buttons visible, no functionality |
| **Search bar** | Lender Dashboard header | Input present, no search logic |
| **Registration Forms** | `/register/borrower`, `/register/lender` | Form UI exists, no data persistence |
| **Loan Application Form** | `/loan-application` | Form UI exists, no data submission |
| **Contact Expert / Schedule Call** | Borrower Dashboard | Buttons visible, non-functional |
| **Notifications** | Dashboard headers | Bell icon visible, no notification system |

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/                # Images and media
│   ├── components/
│   │   ├── Navbar.jsx         # Global navigation bar
│   │   ├── ThemeContext.jsx    # React context for dark/light mode
│   │   ├── ThemeToggle.jsx    # Theme toggle button component
│   │   ├── GlobalThemeToggle.jsx  # Global theme toggle variant
│   │   └── ui/               # Reusable UI components
│   ├── data/
│   │   └── mockData.js       # All mock data (borrowers, applications, lenders)
│   ├── pages/
│   │   ├── LandingPage.jsx        # Marketing homepage
│   │   ├── RoleSelectionPage.jsx  # Borrower vs Lender selection
│   │   ├── LoginPage.jsx          # Authentication page
│   │   ├── BorrowerDashboard.jsx  # Borrower main dashboard
│   │   ├── BorrowerProfile.jsx    # Borrower profile details
│   │   ├── BorrowerRegistration.jsx # Borrower signup form
│   │   ├── BorrowerMonitoring.jsx # Detailed borrower monitoring (lender view)
│   │   ├── LenderDashboard.jsx    # Lender main dashboard
│   │   ├── LenderRegistration.jsx # Lender signup form
│   │   ├── LenderPlans.jsx        # Lender subscription plans
│   │   ├── MyBorrowers.jsx        # Borrower list for lenders
│   │   ├── LoanApplications.jsx   # Application list for lenders
│   │   ├── ApplicationDetail.jsx  # Application deep-dive page
│   │   ├── LoanApplication.jsx    # Loan application form (borrower)
│   │   ├── FindLender.jsx         # Lender discovery for borrowers
│   │   ├── Recommendations.jsx    # AI recommendations for borrowers
│   │   ├── DocumentUpload.jsx     # Document upload interface
│   │   └── AlertDetail.jsx        # Alert details page
│   ├── App.jsx               # Root component with all routes
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies and scripts
└── eslint.config.js          # Linting configuration
```

---

## 🎯 How to Use the App

### As a Borrower

1. Go to `http://localhost:5173` → Click **"Get Started"** on the landing page
2. On the login page, click the **"Borrower Demo"** button → Click **"Sign In"**
3. You'll land on the **Borrower Dashboard** showing your health score, income vs expense chart, and loan eligibility
4. Use the **sidebar** to navigate:
   - **Recommendations** → See AI-suggested loan products
   - **Documents** → Upload KYC and income verification docs
   - **Find Lenders** → Browse and compare 10 lenders with ratings and interest rates
5. Click **"Apply Now"** to go to the loan application form

### As a Lender

1. On the login page, click the **"Lender Demo"** button → Click **"Sign In"**
2. You'll land on the **Lender Dashboard** showing portfolio metrics, risk alerts, and recent applications
3. Use the **sidebar** to navigate:
   - **Borrowers** → See all 5 borrowers with risk scores → Click any borrower for detailed monitoring (cash flow, EMI history, risk assessment)
   - **Applications** → View all 5 loan applications → Click any for full credit analysis with approve/reject actions
   - **Alerts** → View detailed risk alerts with action buttons

### Theme Toggle

- Every page has a **🌙/☀️ theme toggle** button (usually top-right)
- Click to switch between **dark mode** and **light mode**
- Your preference is persisted via React Context

---

## 🗺️ Roadmap (Upcoming)

The following features are planned but not yet implemented:

- [ ] **Analytics Dashboard** — Charts and graphs for portfolio performance
- [ ] **Transaction History** — View past EMI payments and disbursements
- [ ] **Settings Page** — User profile editing, notification preferences
- [ ] **My Health Score Page** — Dedicated borrower health score breakdown
- [ ] **Loans Management** — Active loans tracking for borrowers
- [ ] **Portfolio View** — Lender's full investment portfolio
- [ ] **Backend API Integration** — Connect to a real server with authentication
- [ ] **Real Authentication** — OAuth (Google/LinkedIn) and email/password signup
- [ ] **Notification System** — Real-time alerts and push notifications
- [ ] **Search Functionality** — Global search across borrowers, loans, applications

---

<div align="center">

**Made with ❤️ using React + Vite**

</div>
