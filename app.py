from flask import Flask, render_template, request, jsonify
import os
import json
import re
import random
import torch
from modules.mcq_generator import MCQGenerator
from modules.role_classifier import UserResponseClassifier

app = Flask(__name__)

# Load models
PROJECT_PATH = os.getcwd()
device = "cuda" if torch.cuda.is_available() else "cpu"

mcq = MCQGenerator(
    os.path.join(PROJECT_PATH, "word_seq2seq_mcq_gen.pth"),
    os.path.join(PROJECT_PATH, "word_vocab.json"),
    device
)

classifier = UserResponseClassifier(
    os.path.join(PROJECT_PATH, "user_response_classifier.pth"),
    os.path.join(PROJECT_PATH, "response_vocab.json"),
    os.path.join(PROJECT_PATH, "role_labels.json"),
    device
)

with open(os.path.join(PROJECT_PATH, "quiz_trait_config.json")) as f:
    config = json.load(f)

with open(os.path.join(PROJECT_PATH, "trait_to_options_cleaned.json")) as f:
    trait_to_options = json.load(f)

all_traits = config.get("all_traits", [])
confidence_threshold = config.get("confidence_threshold", 0.92)
max_questions = config.get("max_questions", 15)

# Session state (in-memory for now)
sessions = {}

def render_mcq(qtext, options):
    q_clean = re.split(r"\s?\[[A-Da-d]\]", qtext)[0].strip(" -–:?.").capitalize()
    if not q_clean.endswith("?"):
        q_clean += "?"
    return q_clean, [f"{opt}" for opt in options]

def find_trait_key(trait, trait_dict):
    trait_norm = trait.strip().lower()
    for key in trait_dict.keys():
        if key.strip().lower() == trait_norm:
            return key
    return None

@app.route('/')
def index():
    return render_template("SkillPath_quiz.html")

@app.route('/start_quiz', methods=['POST'])
def start_quiz():
    session_id = str(len(sessions))
    random.shuffle(all_traits)
    sessions[session_id] = {
        "pointer": 0,
        "asked": set(),
        "seen": set(),
        "responses": [],
        "answers": []
    }
    return jsonify({"session_id": session_id})

@app.route('/get_question', methods=['POST'])
def get_question():
    data = request.json
    session = sessions[data['session_id']]
    pointer = session["pointer"]
    
    while pointer < len(all_traits) and len(session["asked"]) < max_questions:
        trait = all_traits[pointer]
        pointer += 1
        if trait in session["asked"]:
            continue

        prompt_text = trait
        mcq_q = mcq.generate(prompt_text)
        attempts = 0
        while (trait.lower() not in mcq_q.lower() and prompt_text.lower() not in mcq_q.lower()) or mcq_q in session["seen"]:
            mcq_q = mcq.generate(prompt_text)
            attempts += 1
            if attempts >= 3:
                mcq_q = f"What do you think about {trait}?"
                break

        session["seen"].add(mcq_q)
        session["pointer"] = pointer
        session["asked"].add(trait)
        trait_key = find_trait_key(trait, trait_to_options)
        options = trait_to_options.get(trait_key, ["A", "B", "C", "D"])
        q_text, labeled_options = render_mcq(mcq_q, options)

        session["last_trait"] = trait
        session["last_question"] = mcq_q
        return jsonify({
            "trait": trait,
            "question": q_text,
            "options": labeled_options,
            "question_number": len(session["asked"])
        })

    return jsonify({"end": True})

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    session = sessions[data['session_id']]
    ans = data['answer'].upper()
    q = session["last_question"]
    
    session["answers"].append((q, ans))
    session["responses"].append(f"{q} -> {ans}")

    response_str = " [SEP] ".join(session["responses"])
    prediction = classifier.predict(response_str)[0]
    should_end = False

    if len(session["asked"]) >= 6 and len(session["asked"]) % 3 == 0 and prediction[1] >= confidence_threshold:
        should_end = True

    return jsonify({
        "interim_role": prediction[0],
        "confidence": round(prediction[1], 2),
        "should_end": should_end
    })

@app.route('/final_prediction', methods=['POST'])
def final_prediction():
    session_id = request.json["session_id"]
    session = sessions[session_id]
    response_str = " [SEP] ".join(session["responses"])
    prediction = classifier.predict(response_str)[0]
    return jsonify({
        "role": prediction[0],
        "confidence": round(prediction[1] * 100),
        "questions_answered": len(session["answers"]),
        "traits_analyzed": len(session["asked"])
    })

if __name__ == '__main__':
    app.run(debug=True)
