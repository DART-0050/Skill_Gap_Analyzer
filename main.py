import os
import json
import random
import re
import sys
import torch

# 📍 Adjust to match your local path
PROJECT_PATH = os.getcwd()
CODE_PATH = os.path.join(PROJECT_PATH, "code")
device = "cuda" if torch.cuda.is_available() else "cpu"
sys.path.append(CODE_PATH)

from mcq_generator import MCQGenerator
from role_classifier import UserResponseClassifier

# Load models
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

# Load config and options
with open(os.path.join(PROJECT_PATH, "quiz_trait_config.json")) as f:
    config = json.load(f)

with open(os.path.join(PROJECT_PATH, "trait_to_options_cleaned.json")) as f:
    trait_to_options = json.load(f)

all_traits = config.get("all_traits", [])
random.shuffle(all_traits)

confidence_threshold = config.get("confidence_threshold", 0.92)
max_questions = config.get("max_questions", 15)

# Utilities
def render_mcq(qtext, options):
    q_clean = re.split(r"\s?\[[A-Da-d]\]", qtext)[0].strip(" -–:?.").capitalize()
    if not q_clean.endswith("?"):
        q_clean += "?"
    labeled = [f"[{l}] {opt}" for l, opt in zip("ABCD", options)]
    return f"{q_clean} " + " ".join(labeled)

def find_trait_key(trait, trait_dict):
    trait_norm = trait.strip().lower()
    for key in trait_dict.keys():
        if key.strip().lower() == trait_norm:
            return key
    return None

# Main quiz loop
user_answers = []
response_sequence = []
pointer = 0
asked = set()
seen_questions = set()

while pointer < len(all_traits) and len(asked) < max_questions:
    trait = all_traits[pointer]
    pointer += 1
    if trait in asked:
        continue

    prompt_text = trait
    mcq_q = mcq.generate(prompt_text)

    attempts = 0
    while (trait.lower() not in mcq_q.lower() and prompt_text.lower() not in mcq_q.lower()) or mcq_q in seen_questions:
        mcq_q = mcq.generate(prompt_text)
        attempts += 1
        if attempts >= 3:
            mcq_q = f"What do you think about {trait}?"
            break

    seen_questions.add(mcq_q)
    trait_key = find_trait_key(trait, trait_to_options)
    options = trait_to_options.get(trait_key, ["A", "B", "C", "D"])

    print(f"\n🔹 Trait: {trait}")
    print("Q:", render_mcq(mcq_q, options))
    ans = input("Your answer (A/B/C/D): ").strip().upper()
    while ans not in ["A", "B", "C", "D"]:
        ans = input("Please enter A, B, C, or D: ").strip().upper()

    user_answers.append((mcq_q, ans))
    response_sequence.append(f"{mcq_q} -> {ans}")
    asked.add(trait)

    if len(asked) >= 6 and len(asked) % 3 == 0:
        seq = " [SEP] ".join(response_sequence)
        top = classifier.predict(seq)[0]
        print(f"📊 Interim Prediction: {top[0]} ({top[1]:.2f})")
        if top[1] >= confidence_threshold:
            print(f"✅ Confidence {top[1]:.2f} > {confidence_threshold}. Ending early.")
            break

# Final prediction
response_str = " [SEP] ".join(response_sequence)
top_prediction = classifier.predict(response_str)[0]
print("\n🔮 Final Predicted Role:")
print(f"{top_prediction[0]} ({top_prediction[1]:.2f})")
