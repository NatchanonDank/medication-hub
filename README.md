# 💊 MedHub - Modern Decoupled SPA Medication Hub

A Mini Project for the Web Application Development course, built using the Modern Decoupled Single Page Application (SPA) architecture.

---

## 👥 Team Members
* **Mr. Natchanon Dankijyingyong (F)** - Student ID: `1650701343` (Full Application Development: Frontend, Routing, State Management, UI/UX)
* **Mr. Nattapob Samittinan (Tae)** - Student ID: `1660701648` (Documentation)

---

## 🚀 Tech Stack
* **Framework:** React + Vite (TypeScript)
* **Styling & UI:** Tailwind CSS, DaisyUI (Dark Theme Aesthetic)
* **Routing:** React Router v7
* **Server State Management:** TanStack Query (configured with a 5-minute staleTime and caching)
* **Client State Management:** Zustand (with `persist` middleware for local storage)

---

## 📌 Features & Pages
1. **Medication List Page:** Displays all 48 mock medications with a real-time search bar, a toggle filter for the personal medical kit, and a loading skeleton UI.
2. **Medication Detail Page:** Shows in-depth information, product imagery, and a custom collapsible "Additional Information" section.
3. **My Medical Kit Page:** Manages the user's selected personal medication collection, persistently stored via Zustand.
4. **Drug Interaction Checker Page:** A custom interactive tool allowing users to select two medications to evaluate potential safety risks and warnings (Safe, Warning, Danger).
5. **About Page:** Showcases team member profiles, student IDs, responsibilities, and data attributions.

---

## 🛠️ Getting Started

1. **Clone the Repository**
   ```bash
   git clone <REPOSITORY_URL>
   cd medication-hub
