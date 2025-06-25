import torch
import torch.nn as nn
import json
import re

# -------------------------------
# Tokenizer + Label Utils
# -------------------------------

def tokenize(text):
    return re.sub(r'[^a-zA-Z0-9\->\[\] ]', '', text).lower().split()

def encode_text(text, word2idx, max_len=100):
    tokens = tokenize(text)
    tokens = tokens[:max_len]
    ids = [word2idx.get(w, word2idx["<UNK>"]) for w in tokens]
    ids += [0] * (max_len - len(ids))
    return ids

# -------------------------------
# Model Definition
# -------------------------------

class RoleClassifier(nn.Module):
    def __init__(self, vocab_size, hidden_dim=256, num_classes=160):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, 128, padding_idx=0)
        self.gru = nn.GRU(128, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)

    def forward(self, x):
        x = self.emb(x)
        _, h = self.gru(x)
        return self.fc(h.squeeze(0))

# -------------------------------
# Classifier Wrapper
# -------------------------------

class UserResponseClassifier:
    def __init__(self, model_path, vocab_path, label_path, device="cpu"):
        with open(vocab_path) as f:
            self.word2idx = json.load(f)
        with open(label_path) as f:
            self.role2idx = json.load(f)

        self.idx2role = {i: r for r, i in self.role2idx.items()}
        self.num_roles = len(self.role2idx)
        self.vocab_size = len(self.word2idx)
        self.device = device

        self.model = RoleClassifier(self.vocab_size, num_classes=self.num_roles).to(device)
        self.model.load_state_dict(torch.load(model_path, map_location=device))
        self.model.eval()

    def predict(self, sequence, max_len=100):
        x = torch.tensor([encode_text(sequence, self.word2idx, max_len)], dtype=torch.long).to(self.device)
        with torch.no_grad():
            logits = self.model(x)
            probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        top3 = probs.argsort()[-3:][::-1]
        return [(self.idx2role[i], float(probs[i])) for i in top3]