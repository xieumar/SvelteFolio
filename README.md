# The Velocity Terminal | Developer Portfolio

A premium, cinematic developer portfolio built with **Svelte 5** and **Tailwind CSS 4**. Designed for developers who want to showcase their work with a high-performance, interactive, and terminal-inspired aesthetic.

![Velocity Terminal Preview](https://raw.githubusercontent.com/xieumar/SvelteFolio/main/static/banner.png) *(Note: Add your own banner here)*

## Overview

**The Velocity Terminal** is more than just a portfolio; it's an immersive digital experience. It combines modern web technologies with a sleek "cyber-terminal" aesthetic, featuring smooth animations, interactive elements, and a high-end feel that stands out from traditional static portfolios.

## Key Features

- **Hero Terminal**: An interactive terminal interface that greets visitors with dynamic typing effects and developer-centric data.
- **Project Cinematic**: A stunning, motion-heavy showcase for your best work, utilizing GSAP for ultra-smooth transitions.
- **Integrated Mini-Game**: An "Arcade" section to engage visitors with a fun, interactive terminal-based game.
- **Command Palette**: Ctrl + K (or Cmd + K) functionality for lightning-fast navigation across the site.
- **Adaptive Theming**: Built-in support for Dark and Light modes with persistent state management.
- **Smooth Motion**: Integrated **Lenis** for buttery-smooth inertial scrolling across all devices.
- **Contact System**: A robust contact form powered by Nodemailer for seamless communication.

## Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) (utilizing the latest Runes for reactivity)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (next-gen performance)
- **Animations**: [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform)
- **Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis) (Smooth Scroll)
- **Icons**: [Iconify](https://iconify.design/) & [Lucide Svelte](https://lucide.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- pnpm / npm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xieumar/SvelteFolio.git
   cd portfolio-sprint
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   VITE_CONTACT_EMAIL=your-email@example.com
   EMAIL_PASSWORD=your-app-password
   ```

### Development

Start the development server with Vite:
```bash
pnpm dev
```

### Building for Production

To create an optimized production build:
```bash
pnpm build
```

You can preview the build locally with:
```bash
pnpm preview
```

## Project Structure

- `src/lib/components`: Atomic and organism-level Svelte components.
- `src/lib/theme.svelte.ts`: Global theme state management using Svelte Runes.
- `src/routes/api`: Serverless functions for the contact form and other backend needs.
- `static/projects`: High-quality assets for project showcases.

## Contributing

Contributions are welcome! If you have a suggestion that would make this portfolio better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


