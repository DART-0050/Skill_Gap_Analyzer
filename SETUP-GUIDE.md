# SkillPath AI - Local Setup Guide

## Overview

SkillPath AI is a comprehensive career discovery platform that uses AI to help users find their ideal tech career path through a 3-stage quiz system (Cluster → Domain → Role prediction).

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18 or higher)

   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)

   - Verify installation: `npm --version`

3. **Git** (for version control)

   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **VS Code** (recommended editor)
   - Download from: https://code.visualstudio.com/

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Prettier - Code formatter
- Auto Rename Tag

## Step-by-Step Setup Instructions

### 1. Extract and Open Project

1. **Extract the ZIP file** to your desired location (e.g., `C:\Projects\skillpath-ai` or `~/Projects/skillpath-ai`)
2. **Open VS Code**
3. **Open the project folder**:
   - File → Open Folder → Select the extracted `skillpath-ai` folder
   - Or drag and drop the folder into VS Code

### 2. Install Dependencies

1. **Open the VS Code Terminal**:
   - Terminal → New Terminal (or Ctrl+Shift+`)
2. **Verify you're in the project directory**:

   ```bash
   pwd  # Should show your project path
   ls   # Should show package.json and other project files
   ```

3. **Install project dependencies**:

   ```bash
   npm install
   ```

   This will:

   - Install all required packages listed in `package.json`
   - Create a `node_modules` folder
   - Generate a `package-lock.json` file
   - May take 2-5 minutes depending on your internet connection

### 3. Start the Development Server

1. **Run the development server**:

   ```bash
   npm run dev
   ```

2. **Wait for the server to start**:

   - You should see output similar to:

   ```
   VITE v6.2.2  ready in 543 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
   ```

3. **Open your browser**:
   - Navigate to `http://localhost:5173/`
   - The SkillPath AI homepage should load

### 4. Verify Everything is Working

#### Test User Authentication

1. **Sign up a new account** or use demo accounts:
   - **Alice (Completed Quiz)**: `alice@example.com` / any password
   - **Charlie (New User)**: `charlie@example.com` / any password

#### Test the 3-Stage Quiz Flow

1. **Login as Charlie** to experience the complete quiz
2. **Take the quiz** through all 3 stages:
   - Stage 1: Cluster prediction
   - Stage 2: Domain prediction
   - Stage 3: Role prediction
3. **View the dashboard** with your predicted career path

#### Test Navigation

- Homepage → Sign up → Login → Quiz → Dashboard
- All navigation links should work
- Mobile responsive design should work on different screen sizes

## Project Structure

```
skillpath-ai/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ui/           # Shadcn/ui components
│   ├── data/             # JSON datasets
│   │   ├── clusters.json
│   │   ├── domains.json
│   │   ├── roles_full.json
│   │   ├── cluster_questions.json
│   │   ├── domain_questions.json
│   │   ├── role_questions_full.json
│   │   ├── users.json
│   │   ├── full_role_skills.json
│   │   └── skill_resources.json
│   ├── lib/              # Utility functions
│   │   ├── api.ts        # API simulation functions
│   │   ├── auth.ts       # Authentication utilities
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── utils.ts      # General utilities
│   ├── pages/            # Application pages
│   │   ├── Index.tsx     # Homepage
│   │   ├── Login.tsx     # Login page
│   │   ├── Signup.tsx    # Signup page
│   │   ├── Quiz.tsx      # 3-stage career quiz
│   │   ├── Dashboard.tsx # User dashboard
│   │   ├── SkillGap.tsx  # Skill gap analysis
│   │   ├── Learn.tsx     # Learning resources
│   │   └── HowItWorks.tsx # How it works page
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run test`** - Run tests
- **`npm run typecheck`** - Check TypeScript types
- **`npm run format.fix`** - Format code with Prettier

## Key Features Implemented

### 🧠 AI-Powered 3-Stage Quiz

- **Stage 1**: Cluster prediction (5 tech clusters)
- **Stage 2**: Domain prediction (based on cluster)
- **Stage 3**: Role prediction (based on domain)
- **Real-time predictions** after each stage
- **Progress tracking** throughout the quiz

### 👤 User Authentication

- Secure signup and login
- Demo accounts for testing
- JWT-like token storage
- Route protection

### 📊 Dashboard & Analytics

- Complete career path display (Cluster → Domain → Role)
- Job readiness percentage
- Skill gap analysis
- Progress tracking
- Learning recommendations

### 🎨 Modern UI/UX

- Dark theme design
- Purple color scheme for buttons
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional branding

### 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly interactions

## Demo Accounts

### Alice (Completed Quiz User)

- **Email**: `alice@example.com`
- **Password**: any password
- **Predicted Path**: Data, AI & Analytics → Data Science → Data Scientist
- **Status**: Quiz completed, goes directly to dashboard

### Charlie (New User)

- **Email**: `charlie@example.com`
- **Password**: any password
- **Status**: No quiz completed, goes to quiz flow

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

```bash
Error: Port 5173 is already in use
```

**Solution**: Either stop the other process or use a different port:

```bash
npm run dev -- --port 3000
```

#### 2. Module Not Found Errors

```bash
Cannot resolve module '@/components/...'
```

**Solution**: Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScript Errors

```bash
TypeScript error in src/...
```

**Solution**: Check types and run type checking:

```bash
npm run typecheck
```

#### 4. Tailwind Styles Not Working

**Solution**: Restart the dev server:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Development Tips

1. **Hot Reload**: Changes to files automatically refresh the browser
2. **Console Errors**: Check browser DevTools (F12) for any JavaScript errors
3. **Network Tab**: Monitor API calls in DevTools Network tab
4. **React DevTools**: Install React Developer Tools browser extension for debugging

## Browser Compatibility

### Supported Browsers

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Testing Different Screen Sizes

1. **Desktop**: 1920x1080, 1366x768
2. **Tablet**: 768x1024, 1024x768
3. **Mobile**: 375x667, 414x896, 360x640

Use Chrome DevTools Device Mode (F12 → Toggle device toolbar) to test responsive design.

## Next Steps

### For Development

1. **Add new features** by creating components in `src/components/`
2. **Add new pages** by creating files in `src/pages/` and updating `src/App.tsx`
3. **Modify the quiz logic** by updating files in `src/data/`
4. **Customize styling** by modifying `tailwind.config.ts` and `src/index.css`

### For Production Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Test the build**:
   ```bash
   npm run preview
   ```
3. **Deploy to hosting platforms** like Vercel, Netlify, or AWS

## Support

If you encounter any issues:

1. **Check the console** for error messages
2. **Verify all dependencies** are installed correctly
3. **Ensure Node.js version** is 18 or higher
4. **Try restarting** the development server
5. **Clear browser cache** and hard reload (Ctrl+Shift+R)

The application is designed to be production-ready with proper error handling, responsive design, and modern development practices.

---

**Happy coding! 🚀**
