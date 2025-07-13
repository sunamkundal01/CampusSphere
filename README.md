# CampusSphere 🎓🌐

Your all-in-one academic collaboration platform connecting students through skill-based discovery, material sharing, and personal workspace management. Built with modern web technologies and AI-powered insights.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-green?style=for-the-badge&logo=vercel)](https://campus-sphere-nitsri.vercel.app/)

## Features ✨

- **Academic Material Sharing** - Upload and share PYQs (Previous Year Questions) with your academic community
- **Student Networking** - Connect with peers based on skills, departments, and academic interests
- **Personal Workspace** - Private note-taking with AI-powered PDF analysis and insights
- **Smart Discovery** - Find study partners and collaborators through skill-based matching
- **Community Profiles** - Showcase your academic journey, skills, and expertise
- **Secure Authentication** - User management powered by Clerk
- **Real-time Database** - Built on Convex for seamless data synchronization
- **Responsive UI** - Modern interface built with Next.js 14

## Tech Stack 🛠️

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Convex (Database & Server Functions)
- **Authentication**: Clerk
- **AI**: Gemini API
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Getting Started 🚀

### Prerequisites

- Node.js v18+
- Convex account
- Clerk account
- Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/Ai-Pdf-Note-Taker.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create `.env.local` file with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
CONVEX_DEPLOYMENT=your_convex_deployment
```

4. Run the development server:

```bash
npm run dev
```

## Usage 📖

### For Students & Academic Community

1. **Profile Setup**: Sign up/Sign in using Clerk authentication and complete your academic profile
2. **Community Engagement**:
   - Browse and upload PYQs (Previous Year Questions) to share with your community
   - Discover fellow students based on skills and academic interests
   - Connect with study partners and project collaborators
3. **Personal Workspace**:
   - Upload PDF documents for AI-powered analysis
   - Create and manage private notes with intelligent insights
   - Chat with your PDFs to extract summaries and specific information
4. **Skill-based Discovery**: Find and connect with peers who complement your academic journey

### Dashboard Features

- **Community Tab**: Explore shared academic materials and connect with students
- **Profile Management**: Showcase your skills, department, and academic achievements
- **Workspace**: Access your private PDF analysis and note-taking tools
- **PYQ Repository**: Upload and browse previous year questions

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments 🙏

- Google Gemini API for AI capabilities
- Convex for real-time database functionality
- Clerk for secure authentication
- Vercel for hosting and deployment
