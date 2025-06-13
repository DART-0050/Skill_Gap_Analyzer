export interface User {
  email: string;
  name: string;
  password_hash: string;
  quiz_completed: boolean;
  predicted_cluster: string | null;
  predicted_domain: string | null;
  predicted_role: string | null;
  known_skills: string[];
  learned_skills: string[];
}

export interface QuizQuestion {
  question: string;
  cluster?: string;
  domain?: string;
  role?: string;
}

export interface QuizAnswer {
  question: string;
  answer: "yes" | "no" | "not sure";
  category: string;
}

export interface QuizStageResult {
  stage: "cluster" | "domain" | "role";
  prediction: string;
  answers: QuizAnswer[];
}

export interface SkillGapAnalysis {
  matched_skills: string[];
  missing_skills: string[];
  readiness_percentage: number;
}

export interface LearningResource {
  skill: string;
  title: string;
  url: string;
  description?: string;
}

export interface UserProgress {
  user_email: string;
  completed_resources: string[];
  skill_progress: Record<string, boolean>;
  last_updated: string;
}
