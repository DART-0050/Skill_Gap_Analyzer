
# SkillPath AI

**SkillPath AI** is an AI-powered career discovery platform that dynamically guides users through a personalized quiz to identify their ideal tech role. It uses a custom-trained model (built from scratch) and simulated datasets to predict the most suitable career path across three levels: Cluster → Domain → Role. Users then receive a skill gap analysis and curated learning resources tailored to the predicted role.

---

## 🧠 How the Model Works

🧠 Model and Quiz Engine
SkillPath AI is powered by a custom-built model-based quiz engine built entirely from scratch — without the use of pretrained language models or NLP libraries.

✅ Model Features
Model Type: Custom RNN/Transformer-like model (trained from scratch)

Input Encoding: Responses vectorized as Yes = 1, Maybe = 0.5, No = 0

Architecture: Simple feed-forward or recurrent architecture using NumPy or PyTorch/TensorFlow (depending on your setup)
No External Libraries: No HuggingFace, spaCy, NLTK, or pretrained embeddings used
Training Data: Synthetic Q&A pairs mapped to cluster/domain/role labels

Prediction Flow:

Cluster prediction first (based on cluster_questions.json)
Then domain prediction (based on domain_questions.json)
Finally role prediction (based on role_questions_full.json)

🔁 Dynamic Flow
Stage 1: Cluster Questions
One question from each cluster
Score each based on response

Stage 2: Domain Questions
Pick dominant clusters (highest scores)
Ask follow-up domain-level questions from them

Stage 3: Role Questions
Within top domains, ask specific role questions

Final Output:

Most probable role is predicted
Skill gap analysis is shown based on role → required skills
Learning recommendations are suggested

---

## 🚀 Overview

SkillPath AI empowers users to:

- Discover their ideal tech role through a quiz (Cluster → Domain → Role)
- Analyze skill gaps based on role requirements
- Access curated learning resources to bridge those gaps

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS, Shadcn/ui
- **Routing & State**: React Router, Context API
- **Mock Backend**: users.json
- **AI Logic**: Custom RNN/Transformer (no pretrained models or libraries)
- **Storage**: Local JSON files

---

## 📁 Project Structure

- `src/data/` - All JSON datasets (questions, skills, user data)
- `src/lib/` - AI model logic, auth utilities, type definitions
- `src/pages/` - Quiz flow, Dashboard, Auth pages
- `src/components/` - UI components including Shadcn/ui elements

---

## 📦 Installation & Running

### Prerequisites

- Node.js v18+
- npm
- Git
- VS Code (recommended)

### Setup

```bash
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Accounts

| User     | Email                | Password      | Status                    |
|----------|----------------------|---------------|----------------------------|
| Alice    | <alice@example.com>    | any password  | Quiz completed            |
| Charlie  | <charlie@example.com>  | any password  | New user, no quiz taken   |

---

## 💡 Key Features

- ✅ Dynamic 3-Stage Quiz (AI-driven)
- ✅ Model-based role prediction
- ✅ Custom skill gap analysis
- ✅ Auth with route protection
- ✅ Fully responsive UI with modern design
- ✅ Learning resources mapped to skill gaps

---

## 🔍 Troubleshooting

1. **Port in use**: Run `npm run dev -- --port 3001`
2. **Module errors**: Run `rm -rf node_modules package-lock.json && npm install`
3. **CSS not loading**: Restart dev server

---

## 🚀 Deployment

```bash
npm run build
npm run preview
```

Deploy `/dist` folder on Netlify, Vercel, or Firebase.

---

## 📚 License

This project is for educational and personal use.
