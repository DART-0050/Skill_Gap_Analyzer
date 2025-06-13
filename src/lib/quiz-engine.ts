import { QuizAnswer } from "./types";
import clusterQuestions from "../data/cluster_questions.json";
import domainQuestions from "../data/domain_questions.json";
import roleQuestions from "../data/role_questions_full.json";
import domains from "../data/domains.json";
import rolesData from "../data/roles_full.json";

// Encode answer exactly as in the model
export const encodeAnswer = (ans: string): number => {
  const answer = ans.trim().toLowerCase();
  if (answer === "yes") return 2;
  if (answer === "not sure") return 1;
  return 0; // 'no'
};

// Pad vector to max length
export const padVector = (vec: number[], maxLen: number): number[] => {
  return [...vec, ...Array(maxLen - vec.length).fill(0)];
};

// Simulate the ML model prediction
export const predictModel = (inputVector: number[]): number[] => {
  // Simple mock - in real implementation this would be the actual PyTorch model
  const sum = inputVector.reduce((a, b) => a + b, 0);
  const noise = Math.random() * 0.1;
  return inputVector.map((_, i) => Math.random() + noise);
};

// Mock model training (simplified)
export const trainModel = (labels: string[]) => {
  // In real implementation, this would train the actual PyTorch model
  return {
    predict: (input: number[]) => predictModel(input),
  };
};

export class QuizEngine {
  private questionsDict: Record<string, string[]>;
  private labels: string[];
  private userAnswersDict: Record<string, string[]>;
  private questionIndices: Record<string, number>;
  private maxQuestions: number;
  private model: any;
  private currentQuestions: Array<{ question: string; label: string }> = [];
  private currentQuestionIndex = 0;

  constructor(questionsDict: Record<string, string[]>, labels: string[]) {
    this.questionsDict = questionsDict;
    this.labels = labels;
    this.userAnswersDict = {};
    this.questionIndices = {};
    this.maxQuestions = Math.max(
      ...Object.values(questionsDict).map((q) => q.length),
    );

    // Initialize answer tracking
    labels.forEach((label) => {
      this.userAnswersDict[label] = [];
      this.questionIndices[label] = 0;
    });

    // Train model
    this.model = trainModel(labels);
    this.generateFirstRoundQuestions();
  }

  private generateFirstRoundQuestions() {
    // Round 1: Ask first question from each label (exactly as in model)
    this.currentQuestions = [];
    this.labels.forEach((label) => {
      const question = this.getNextQuestion(label);
      if (question) {
        this.currentQuestions.push({ question, label });
      }
    });
    this.currentQuestionIndex = 0;
  }

  private getNextQuestion(label: string): string | null {
    const idx = this.questionIndices[label];
    if (idx < this.questionsDict[label].length) {
      this.questionIndices[label]++;
      return this.questionsDict[label][idx];
    }
    return null;
  }

  private encodeAnswersDict(): number[] {
    const combined: number[] = [];
    this.labels.forEach((label) => {
      combined.push(
        ...this.userAnswersDict[label].map((ans) => encodeAnswer(ans)),
      );
    });
    return combined;
  }

  private calculateScores(): Record<string, number> {
    const scores: Record<string, number> = {};
    this.labels.forEach((label) => {
      scores[label] = this.userAnswersDict[label].reduce(
        (sum, answer) => sum + encodeAnswer(answer),
        0,
      );
    });
    return scores;
  }

  private getTiedLabels(scores: Record<string, number>): string[] {
    const maxScore = Math.max(...Object.values(scores));
    return Object.entries(scores)
      .filter(([, score]) => score === maxScore)
      .map(([label]) => label);
  }

  getCurrentQuestion(): { question: string; label: string } | null {
    if (this.currentQuestionIndex < this.currentQuestions.length) {
      return this.currentQuestions[this.currentQuestionIndex];
    }
    return null;
  }

  getTotalQuestions(): number {
    return this.currentQuestions.length;
  }

  getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  async answerQuestion(answer: string): Promise<{
    isComplete: boolean;
    prediction?: string;
    needsTieBreak?: boolean;
    tiedLabels?: string[];
    nextQuestion?: { question: string; label: string };
  }> {
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) {
      return { isComplete: true };
    }

    // Record the answer
    this.userAnswersDict[currentQ.label].push(answer);
    this.currentQuestionIndex++;

    // Check if we've finished the current round
    if (this.currentQuestionIndex >= this.currentQuestions.length) {
      return await this.processRoundComplete();
    }

    // Return next question
    const nextQ = this.getCurrentQuestion();
    return {
      isComplete: false,
      nextQuestion: nextQ || undefined,
    };
  }

  private async processRoundComplete(): Promise<{
    isComplete: boolean;
    prediction?: string;
    needsTieBreak?: boolean;
    tiedLabels?: string[];
    nextQuestion?: { question: string; label: string };
  }> {
    const scores = this.calculateScores();
    let tiedLabels = this.getTiedLabels(scores);

    // If no tie, we have a winner
    if (tiedLabels.length === 1) {
      return await this.processFinalConfirmation(tiedLabels[0]);
    }

    // Check if we can do more tie-break rounds
    const currentRound = Math.max(...Object.values(this.questionIndices));
    if (currentRound < this.maxQuestions) {
      return this.generateTieBreakQuestions(tiedLabels);
    }

    // If tie persists after all questions, pick randomly
    const finalLabel =
      tiedLabels[Math.floor(Math.random() * tiedLabels.length)];
    return await this.processFinalConfirmation(finalLabel);
  }

  private generateTieBreakQuestions(tiedLabels: string[]): {
    isComplete: boolean;
    needsTieBreak: boolean;
    tiedLabels: string[];
    nextQuestion?: { question: string; label: string };
  } {
    this.currentQuestions = [];

    tiedLabels.forEach((label) => {
      const question = this.getNextQuestion(label);
      if (question) {
        this.currentQuestions.push({ question, label });
      } else {
        // Default answer for labels with no more questions
        this.userAnswersDict[label].push("no");
      }
    });

    this.currentQuestionIndex = 0;
    const nextQ = this.getCurrentQuestion();

    return {
      isComplete: false,
      needsTieBreak: true,
      tiedLabels,
      nextQuestion: nextQ || undefined,
    };
  }

  private async processFinalConfirmation(finalLabel: string): Promise<{
    isComplete: boolean;
    prediction?: string;
    needsTieBreak?: boolean;
    confirmationQuestion?: { question: string; label: string };
  }> {
    // Get confirmation question
    const confirmQ = this.getNextQuestion(finalLabel);

    if (confirmQ) {
      this.currentQuestions = [{ question: confirmQ, label: finalLabel }];
      this.currentQuestionIndex = 0;

      return {
        isComplete: false,
        confirmationQuestion: { question: confirmQ, label: finalLabel },
      };
    }

    return {
      isComplete: true,
      prediction: finalLabel,
    };
  }

  async processConfirmationAnswer(
    answer: string,
    confirmedLabel: string,
  ): Promise<{
    isComplete: boolean;
    prediction: string;
  }> {
    this.userAnswersDict[confirmedLabel].push(answer);

    // If user says 'no' to confirmation, fall back to model prediction
    if (encodeAnswer(answer) === 0) {
      const inputVec = padVector(
        this.encodeAnswersDict(),
        this.labels.length * this.maxQuestions,
      );
      const probs = this.model.predict(inputVec);

      // Find second-best prediction
      const sortedIndices = probs
        .map((prob: number, index: number) => ({ prob, index }))
        .sort((a: any, b: any) => b.prob - a.prob);

      const secondBestIndex = sortedIndices.find(
        (item: any) => this.labels[item.index] !== confirmedLabel,
      );

      if (secondBestIndex) {
        return {
          isComplete: true,
          prediction: this.labels[secondBestIndex.index],
        };
      }
    }

    return {
      isComplete: true,
      prediction: confirmedLabel,
    };
  }
}

// Factory functions for each stage
export const createClusterQuiz = (): QuizEngine => {
  return new QuizEngine(clusterQuestions, Object.keys(clusterQuestions));
};

export const createDomainQuiz = (cluster: string): QuizEngine => {
  const availableDomains = domains[cluster as keyof typeof domains] || [];
  const domainPool: Record<string, string[]> = {};

  availableDomains.forEach((domain) => {
    const questions = domainQuestions[domain as keyof typeof domainQuestions];
    if (questions) {
      domainPool[domain] = questions;
    }
  });

  return new QuizEngine(domainPool, availableDomains);
};

export const createRoleQuiz = (domain: string): QuizEngine => {
  const availableRoles = rolesData[domain as keyof typeof rolesData] || [];
  const rolePool: Record<string, string[]> = {};

  availableRoles.forEach((role) => {
    const questions = roleQuestions[role as keyof typeof roleQuestions];
    if (questions) {
      rolePool[role] = questions;
    }
  });

  return new QuizEngine(rolePool, availableRoles);
};
