# Health Promotion App (TUH Health-D)

Health Promotion App ("TUH Health-D") is a web application designed to promote health and wellness, likely for Thammasat University Hospital (TUH). It integrates with LINE LIFF to provide users with easy access to health campaigns, assessments, and tracking tools directly through the LINE app.

## Features

- **User Authentication**: Seamless login and integration with LINE via LINE LIFF.
- **Campaigns**: Participate in various health campaigns.
  - **Mental Assessment**: Evaluate mental well-being (Anxiety, Depression, Stress).
  - **Run Activity**: Track running activities.
  - **Bingo Board**: Complete health-related challenges in a bingo format.
- **Profile Management**: Manage user profile information (weight, height, waist, fat percentage, etc.).
- **Ranking**: View leaderboards and rankings for campaigns.
- **News & Announcements**: Stay updated with the latest health news and hospital announcements.
- **Responsive Design**: Mobile-first design optimized for usage within the LINE app.

## Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router) - React Framework
- [React](https://reactjs.org/) - UI Library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - UI Component library for Tailwind
- [MUI (Material UI)](https://mui.com/) & [Emotion](https://emotion.sh/) - UI Components and styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [LINE LIFF SDK](https://developers.line.biz/en/docs/liff/) - Integration with LINE

**Backend:**
- Next.js API Routes (`/app/api`)

**Database & Storage:**
- [Supabase](https://supabase.com/) - Postgres Database & Storage
- MySQL (potentially used for legacy or specific integrations)

## Project Structure

```bash
├── app/                  # Next.js App Router
│   ├── api/              # Backend API routes
│   ├── campaign/         # Campaign pages (Bingo, Run, etc.)
│   ├── ranking/          # Ranking/Leaderboard pages
│   ├── profile/          # User profile pages
│   ├── landing/          # Landing pages
│   ├── layout.tsx        # Root layout with providers (Liff, Auth)
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── campaign/         # Campaign-specific components
│   ├── profile/          # Profile-specific components
│   ├── ranking/          # Ranking-specific components
│   └── ...
├── contexts/             # React Contexts (e.g., LiffContext)
├── utils/                # Utility functions (e.g., supabase client)
├── public/               # Static assets (images, icons)
├── prisma/               # Prisma schema (if applicable)
└── ...
```

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd healthpromotion-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add necessary environment variables (e.g., Supabase URL/Key, LINE LIFF ID).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Runs the app in development mode with Turbopack.
- `npm run build`: Builds the app for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.