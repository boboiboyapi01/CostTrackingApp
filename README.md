# Cost Tracking App

A simple web application to help small business owners and beginners calculate ingredient costs and product production costs without a backend or database.

Live Demo:  
https://cost-tracking-5vn78852y-boboiboyapi01s-projects.vercel.app/

---

## Features

- Ingredient management (price, unit, package size)
- Automatic cost calculation per ingredient
- Product cost calculation based on ingredient composition
- Automatic product cost update when ingredient prices change
- Persistent data using browser localStorage
- Client-side only (no backend, no authentication)
- Clean and responsive user interface

---

## Purpose

This project is designed to solve a practical problem:  
helping small businesses and beginners calculate production costs without technical complexity.

The application intentionally avoids backend services to keep it lightweight, fast, and easy to maintain.

---

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- lucide-react
- Browser localStorage

---

## Data Persistence

All data is stored locally using the browser's localStorage.

This approach ensures:
- Data is preserved on page refresh
- No server or database is required
- Fast and offline-friendly usage

---

## Getting Started

```bash
git clone https://github.com/boboiboyapi01/CostTrackingApp.git
cd CostTrackingApp
npm install
npm run dev
