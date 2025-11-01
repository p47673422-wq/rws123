
# Krishna Touch Dashboard

## Overview
Krishna Touch is a spiritual dashboard for ISKCON book distribution, order management, payments, inventory, team management, and notifications. It is a Next.js PWA with role-based dashboards, push notifications, WhatsApp reminders, and beautiful micro-interactions.

## User Roles & Flow

### 1. Store Owner
- **Dashboard:** View metrics, recent orders, pending payments, top distributors, charts.
- **Orders:** Manage orders, edit, mark as packed/collected, OTP workflow, export, search/sort, pagination.
- **Returns:** Accept/reject return requests, edit items, update inventories, notify distributors.
- **Payments:** Verify payments, view receipts, link to orders, reject with reason, filter/search.
- **Inventory:** Update stock, view history, low stock alerts, export report.
- **Dues:** Track pending/overdue/collected dues, send WhatsApp reminders, bulk actions, view details.
- **Team:** View team, export contacts, see member stats, send reminders.
- **Assisted Order:** Place orders for distributors without phones, collect payment, print receipt.
- **Notifications:** Bell icon for all/unread notifications, mark read, sound toggle, auto-refresh.

### 2. Distributor
- **Dashboard:** View personal orders, inventory, payments, leaderboard, notebook, progress.
- **Order Management:** Place new orders, view status, receive OTP for collection.
- **Returns:** Request returns, track status.
- **Leaderboard:** See top performers, scores.
- **Notebook:** Track follow-ups, free flows.

### 3. Captain
- **Dashboard:** Team overview cards, performance charts, top/underperformers, act as distributor toggle.
- **Team Table:** View distributor stats, orders, dues, inventory, last active.
- **Notifications:** Receive and manage team notifications.

## Features
- **PWA:** Installable, offline support, manifest, icons, meta tags, service worker.
- **Push Notifications:** Subscribe/send, permission request, NotificationProvider, notification center.
- **WhatsApp Reminders:** Send payment reminders via WhatsApp Web, bulk send, logs reminders.
- **Loading States:** Chakra spinner, lotus animation, skeleton loaders for cards/tables/avatars.
- **Micro-Interactions:** Button/card/input effects, confetti on success, animated empty states, page transitions, notification slide-in, score count-up.

## Setup
1. `npm install` (ensure all dependencies are installed)
2. Add Krishna-themed icons to `public/icons/krishna-192.png` and `public/icons/krishna-512.png`
3. `npm run dev` to start development
4. For PWA: build and serve with `npm run build` and `npm start`

## Customization
- Update manifest and icons for branding
- Configure push notification endpoints and VAPID keys in `/api/notifications/send`
- Extend APIs for real database integration
- Add more micro-interactions or spiritual illustrations as desired

## Contribution
Open to ISKCON volunteers and contributors. Please follow spiritual guidelines and best coding practices.

## License
MIT
