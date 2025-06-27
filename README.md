# 🚀 SkillPath AI

**SkillPath AI** is an AI-powered career discovery and skill gap analysis tool. It guides users through an intelligent quiz to identify their ideal tech role and then compares their skills (from resume or selection) with real industry expectations — helping them bridge the gap.

---

## 🧠 How the Quiz & Model Work

### 🧩 3-Stage Prediction Pipeline

1. **Cluster Stage**  
   → One question from each high-level personality cluster  
2. **Domain Stage**  
   → Follow-up questions from top clusters  
3. **Role Stage**  
   → Final questions for specific roles within selected domains  

🔚 Final output is a **predicted tech role** like "Data Scientist", "UX Designer", etc.

---

### 🧠 Model Architecture

- **Built from Scratch** using PyTorch
- **No NLP libraries** (e.g. no HuggingFace, spaCy, etc.)
- **Input Vectorization**:  
  - `Yes` = 1  
  - `Maybe` = 0.5  
  - `No` = 0
- **Data**: Fully synthetic Q&A datasets
- **Architecture**: Feedforward or RNN-like model using basic PyTorch
- **Three output layers**: Cluster → Domain → Role

---

## 🔎 Skill Gap Analyzer

After predicting the user’s role, the app lets them:

- ✅ Upload a resume *(PDF)*
- ✅ Or select skills manually
- ✅ Then compares them against a real dataset (`skills.json`)
- ✅ Shows:
  - ✅ Matched Skills
  - ❌ Missing Skills
  - 📊 Readiness Score (percentage)
  - 🎯 Role-specific learning suggestions *(optional)*

Includes **fuzzy matching** for:
- Roles (e.g. "Creative Thinker" ≈ "Creative Leader")
- Skills (e.g. "Python Programming" ≈ "Python")

---

## 🛠️ Tech Stack

| Layer     | Tech                         |
|----------|------------------------------|
| Frontend | HTML, CSS, JavaScript        |
| Backend  | Flask                         |
| AI Model | PyTorch (custom-built)       |
| Data     | JSON files (questions, skills, traits) |
| Resume   | (Planned) `pdfplumber` for parsing resumes |

---

## 📁 Project Structure

```

SkillPath_AI/
├── app.py                  # Main Flask app
├── templates/              # HTML frontend pages
│   ├── SkillPath_quiz.html
│   ├── SkillGap.html
│   ├── About.html
│   └── Contact.html
├── static/                 # Backgrounds, icons, images, skills.json
│   ├── icon.jpg
│   └── role_skills.json
├── modules/                # mcq_generator.py, role_classifier.py
├── word_vocab.json         # Model vocab files
├── user_response_classifier.pth
├── word_seq2seq_mcq_gen.pth
└── requirements.txt

````

---

## 📦 Installation & Setup

### 🔧 Prerequisites

- Python 3.8+
- pip
- Git

### ⚙️ Setup

```bash
git clone https://github.com/DART-0050/Skill_Gap_Analyzer.git
cd skillpath-ai
pip install -r requirements.txt
python app.py
````

Visit: [http://localhost:5000](http://localhost:5000)

---

## 🧠 Sample Backend Dependencies

```txt
torch>=1.13.0
transformers>=4.25.0
flask>=2.2.0
pandas>=1.4.0
numpy>=1.22.0
scikit-learn>=1.1.0
tqdm>=4.64.0
pdfplumber                  # (optional - for resume parsing)
fuzzywuzzy[speedup]
python-Levenshtein
```

---

## 🔐 Data Privacy

SkillPath AI does **not collect or store any personal data**. All processing is done locally via browser and backend Flask session.

---

## 🚀 Features

* ✅ 3-stage adaptive quiz
* ✅ Real-time role prediction
* ✅ Resume + manual skill comparison
* ✅ Matched & missing skill analysis
* ✅ Readiness score
* ✅ Responsive UI with modern design
* ✅ "We’re working on it" placeholder for future learning module
* ✅ About, Contact, Navigation pages

---

## 📚 License

This project is for educational and personal use only.

---

## 👥 Authors

* [Pathmhajam](mailto:pathmhajam@gmail.com)
* [Samhita Shankar](mailto:samhitashankar.cse@gmail.com)
* [Shanmathi](mailto:shanmathi.s.a.cse@gmail.com)

```

---

