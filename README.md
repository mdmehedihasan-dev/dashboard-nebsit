# NEBS-IT (nebs-it)

A modern HR/employee management front-end built with Vite + React and Tailwind CSS.

🔗 Live API URL: https://dashboard-nebsit.vercel.app

## Overview

NEBS-IT Dashboard is a modern HR and employee management front-end application developed using Vite, React, and Tailwind CSS. The project focuses on building a clean, responsive, and scalable UI for managing organizational workflows such as employee information, attendance, payroll, and internal notices.

A key feature of this application is the **Notice Management module**, where administrators can create, publish, and manage notices through an intuitive interface. The system includes form validation, notice type selection, status control (published/unpublished), and paginated notice listings, all integrated with backend APIs.

The application follows a modular architecture with reusable components, centralized API handling, protected routes, and state management, ensuring maintainability and performance. It is designed to easily scale as additional HR features are introduced.
## Tech Stack

- React (via Vite)
- Tailwind CSS
- Vite (dev tooling)
- JavaScript / JSX

## Features

- Dashboard and analytics pages
- Employee management (add, list, performance)
- Notice board and notices API integration
- Routing with protected routes
- Tailwind-based responsive UI

## Project Structure (important files)

- `src/main.jsx` — app entry
- `src/index.css` — global styles (Tailwind)
- `src/Components/Sidebar/Sidebar.jsx` — primary navigation
- `src/Layout/Main/Main.jsx` — main layout wrapper
- `src/Pages` — application pages (Dashboard, Attendance, Payroll, etc.)
- `src/features/store.js` — Redux/store setup
- `src/api/noticesApi.js` — example API integration
- `src/utils/api.js` — HTTP client wrappers

## Local Setup

Requirements: Node.js >= 16 and npm (or pnpm/yarn).

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

## Scripts (common)

- `dev` — start Vite dev server
- `build` — create production build
- `preview` — locally preview production build

Check `package.json` for the exact scripts available.

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests, and submit PRs for fixes or enhancements.

## License

This project does not include a license file in the repository. Add a `LICENSE` file if you wish to open-source under a specific license.


👤 Author

Md Mehedi Hasan

Full Stack Developer (MERN Stack)

GitHub: https://github.com/mdmehedihasan-dev

LinkedIn: https://www.linkedin.com/in/mdmehedihasanmr

Email: mdmehedihasandev0@gmail.com

Location: Benarosi Polli, Mirpur 10, Dhaka.
