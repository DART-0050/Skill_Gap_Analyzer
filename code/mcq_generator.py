import torch
import torch.nn as nn
import json
import re

# -------------------------------
# Tokenizer Utilities
# -------------------------------

def tokenize(text):
    return text.strip().lower().split()

def encode(text, word2idx, add_sos_eos=False):
    tokens = [word2idx.get(w, word2idx["<UNK>"]) for w in tokenize(text)]
    if add_sos_eos:
        tokens = [word2idx["<SOS>"]] + tokens + [word2idx["<EOS>"]]
    return tokens

def decode(ids, idx2word):
    return " ".join([idx2word.get(i, "") for i in ids if i != 0])

# -------------------------------
# Model Definitions
# -------------------------------

class Encoder(nn.Module):
    def __init__(self, vocab_size, emb=128, hid=256):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, emb, padding_idx=0)
        self.gru = nn.GRU(emb, hid, batch_first=True)

    def forward(self, x):
        x = self.emb(x)
        _, h = self.gru(x)
        return h

class Decoder(nn.Module):
    def __init__(self, vocab_size, emb=128, hid=256):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, emb, padding_idx=0)
        self.gru = nn.GRU(emb, hid, batch_first=True)
        self.fc = nn.Linear(hid, vocab_size)

    def forward(self, y, h):
        y = self.emb(y)
        out, _ = self.gru(y, h)
        return self.fc(out)

class Seq2Seq(nn.Module):
    def __init__(self, vocab_size, emb=128, hid=256):
        super().__init__()
        self.encoder = Encoder(vocab_size, emb, hid)
        self.decoder = Decoder(vocab_size, emb, hid)

    def forward(self, x, y):
        h = self.encoder(x)
        return self.decoder(y[:, :-1], h)

# -------------------------------
# Generator Wrapper
# -------------------------------

class MCQGenerator:
    def __init__(self, model_path, vocab_path, device="cpu"):
        with open(vocab_path) as f:
            self.word2idx = json.load(f)
        self.idx2word = {i: w for w, i in self.word2idx.items()}
        self.vocab_size = len(self.word2idx)
        self.device = device

        self.model = Seq2Seq(self.vocab_size).to(device)
        self.model.load_state_dict(torch.load(model_path, map_location=device))
        self.model.eval()

    def generate(self, prompt, max_len=50):
        x = torch.tensor([encode(prompt, self.word2idx)], dtype=torch.long).to(self.device)
        h = self.model.encoder(x)
        y = torch.tensor([[self.word2idx["<SOS>"]]], dtype=torch.long).to(self.device)

        result = []
        for _ in range(max_len):
            out = self.model.decoder(y, h)
            next_id = out[0, -1].argmax().item()
            if next_id == self.word2idx["<EOS>"]:
                break
            result.append(next_id)
            y = torch.cat([y, torch.tensor([[next_id]], device=self.device)], dim=1)

        return decode(result, self.idx2word)