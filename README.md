# CampusSphere

Your all-in-one academic collaboration platform connecting students through skill-based discovery, material sharing, and personal workspace management. Built with modern web technologies and AI-powered insights.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-green?style=for-the-badge&logo=vercel)](https://campus-sphere-nitsri.vercel.app/)

## Features

- **Academic Material Sharing** - Upload and share PYQs (Previous Year Questions) with your academic community
- **Student Networking** - Connect with peers based on skills, departments, and academic interests
- **Personal Workspace** - Private note-taking with a rich text editor and AI-powered PDF analysis
- **Smart Discovery** - Find study partners and collaborators through skill-based matching
- **Community Profiles** - Showcase your academic journey, skills, and expertise
- **AI Chat with PDFs** - Upload PDFs and ask questions to get summaries and insights powered by Google Gemini
- **Export Notes** - Export your notes as DOCX documents
- **Real-time Database** - Built on Convex for seamless data synchronization

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Backend** | Convex (Database, Server Functions & File Storage) |
| **Authentication** | Firebase (Google OAuth) |
| **AI** | Google Gemini API + LangChain |
| **Text Editor** | Tiptap |
| **UI Components** | shadcn/ui (Radix UI) |
| **Styling** | Tailwind CSS |
| **Hosting** | Vercel |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://console.firebase.google.com/) project with Google sign-in enabled
- A [Convex](https://www.convex.dev/) account and project
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sunamkundal01/CampusSphere.git
   cd CampusSphere
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Convex**

   If this is your first time, log in and initialize Convex:

   ```bash
   npx convex dev
   ```

   This will prompt you to create or link a Convex project and will push your schema and functions.

4. **Set up environment variables**

   Create a `.env.local` file in the project root:

   ```env
   # Firebase Authentication
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Convex
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   CONVEX_DEPLOYMENT=dev:your-deployment

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

   **Where to get these values:**
   - **Firebase** - Go to your [Firebase Console](https://console.firebase.google.com/) > Project Settings > General > Your apps > Web app config
   - **Convex** - Go to your [Convex Dashboard](https://dashboard.convex.dev/) > Settings > URL & Deploy Key
   - **Gemini** - Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key

5. **Run the development server**

   You need two terminals running simultaneously:

   **Terminal 1** - Convex backend:
   ```bash
   npx convex dev
   ```

   **Terminal 2** - Next.js frontend:
   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
CampusSphere/
├── app/
│   ├── (auth)/              # Sign-in and sign-up pages
│   ├── api/                 # API routes (Gemini AI, PDF loader)
│   ├── dashboard/           # Main dashboard with community, profile, PYQs
│   │   └── _components/     # Dashboard components
│   └── workspace/           # Personal workspace (PDF viewer, text editor)
│       └── _components/     # Workspace components
├── components/ui/           # Reusable UI components (shadcn/ui)
├── configs/                 # AI model configuration
├── convex/                  # Backend functions, schema, and file storage
├── lib/                     # Utilities, Firebase config, auth context
└── public/                  # Static assets
```

## Usage

### Getting Started as a User

1. **Sign up** using your Google account
2. **Complete your profile** - Add your name, department, skills, and bio
3. **Explore the dashboard** - Browse the community, connect with students, and share materials

### Dashboard

- **Community** - Discover students by skills and department, view shared profiles
- **PYQ Repository** - Upload and browse previous year question papers by subject and year
- **Profile** - Manage your academic profile and showcase your skills

### Workspace

- **Upload PDFs** - Upload documents for AI-powered analysis
- **Chat with PDFs** - Ask questions about your uploaded PDFs and get AI-generated answers
- **Rich Text Notes** - Take notes alongside your PDFs using the built-in editor
- **Export** - Download your notes as DOCX files

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx convex dev` | Start Convex dev server and sync functions |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI capabilities
- [Convex](https://www.convex.dev/) for real-time database functionality
- [Firebase](https://firebase.google.com/) for authentication
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tiptap](https://tiptap.dev/) for the rich text editor
- [shadcn/ui](https://ui.shadcn.com/) for UI components
