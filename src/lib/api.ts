import { User, SkillGapAnalysis, QuizAnswer, QuizStageResult } from "./types";
import users from "../data/users.json";
import clusters from "../data/clusters.json";
import domains from "../data/domains.json";
import rolesData from "../data/roles_full.json";
import clusterQuestions from "../data/cluster_questions.json";
import domainQuestions from "../data/domain_questions.json";
import roleQuestions from "../data/role_questions_full.json";
import fullRoleSkills from "../data/full_role_skills.json";
import skillResources from "../data/skill_resources.json";

// Simulate API calls with local data
export const mockUsers: User[] = users.users;

export const loginUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    throw new Error("User not found");
  }

  // In production, you'd verify the password hash
  // For demo purposes, we'll accept any password
  return user;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    email,
    name,
    password_hash: `$2b$12$${btoa(password)}`, // Mock hash
    quiz_completed: false,
    predicted_cluster: null,
    predicted_domain: null,
    predicted_role: null,
    known_skills: [],
    learned_skills: [],
  };

  // In production, this would save to the backend
  mockUsers.push(newUser);

  return newUser;
};

export const getUserData = async (email: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockUsers.find((u) => u.email === email) || null;
};

export const updateUserQuizResult = async (
  email: string,
  results: {
    cluster: string;
    domain: string;
    role: string;
  },
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const userIndex = mockUsers.findIndex((u) => u.email === email);
  if (userIndex !== -1) {
    mockUsers[userIndex].quiz_completed = true;
    mockUsers[userIndex].predicted_cluster = results.cluster;
    mockUsers[userIndex].predicted_domain = results.domain;
    mockUsers[userIndex].predicted_role = results.role;
  }
};

export const analyzeSkillGap = (
  userSkills: string[],
  targetRole: string,
): SkillGapAnalysis => {
  const requiredSkills =
    fullRoleSkills[targetRole as keyof typeof fullRoleSkills] || [];

  const matched_skills = userSkills.filter((skill) =>
    requiredSkills.includes(skill),
  );
  const missing_skills = requiredSkills.filter(
    (skill) => !userSkills.includes(skill),
  );

  const readiness_percentage = Math.round(
    (matched_skills.length / requiredSkills.length) * 100,
  );

  return {
    matched_skills,
    missing_skills,
    readiness_percentage,
  };
};

export const getSkillResources = (skill: string) => {
  const resource = skillResources[skill as keyof typeof skillResources];
  if (!resource) return null;

  const [title, url] = resource.split(" – ");
  return {
    skill,
    title: title || `Learn ${skill}`,
    url: url || "#",
    description: `Comprehensive resources to master ${skill}`,
  };
};

export const markSkillAsLearned = async (
  email: string,
  skill: string,
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const userIndex = mockUsers.findIndex((u) => u.email === email);
  if (userIndex !== -1) {
    if (!mockUsers[userIndex].learned_skills.includes(skill)) {
      mockUsers[userIndex].learned_skills.push(skill);
    }
  }
};

// Mock ML model prediction functions for each stage
export const predictCluster = async (
  answers: QuizAnswer[],
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simple rule-based prediction for demo
  const scores = answers.reduce(
    (acc, answer) => {
      if (answer.answer === "yes")
        acc[answer.category] = (acc[answer.category] || 0) + 2;
      if (answer.answer === "not sure")
        acc[answer.category] = (acc[answer.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCluster = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return topCluster ? topCluster[0] : clusters.clusters[0];
};

export const predictDomain = async (
  cluster: string,
  answers: QuizAnswer[],
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const availableDomains = domains[cluster as keyof typeof domains] || [];

  // Simple rule-based prediction for demo
  const scores = answers.reduce(
    (acc, answer) => {
      if (availableDomains.includes(answer.category)) {
        if (answer.answer === "yes")
          acc[answer.category] = (acc[answer.category] || 0) + 2;
        if (answer.answer === "not sure")
          acc[answer.category] = (acc[answer.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const topDomain = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return topDomain ? topDomain[0] : availableDomains[0];
};

export const predictRole = async (
  domain: string,
  answers: QuizAnswer[],
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const availableRoles = rolesData[domain as keyof typeof rolesData] || [];

  // Simple rule-based prediction for demo
  const scores = answers.reduce(
    (acc, answer) => {
      if (availableRoles.includes(answer.category)) {
        if (answer.answer === "yes")
          acc[answer.category] = (acc[answer.category] || 0) + 2;
        if (answer.answer === "not sure")
          acc[answer.category] = (acc[answer.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const topRole = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return topRole ? topRole[0] : availableRoles[0];
};

// Get questions for each stage
export const getClusterQuestions = () => {
  const questions: Array<{ question: string; category: string }> = [];
  Object.entries(clusterQuestions).forEach(([cluster, questionList]) => {
    questionList.forEach((question) => {
      questions.push({ question, category: cluster });
    });
  });
  return questions;
};

export const getDomainQuestions = (cluster: string) => {
  const availableDomains = domains[cluster as keyof typeof domains] || [];
  const questions: Array<{ question: string; category: string }> = [];

  availableDomains.forEach((domain) => {
    const domainQuestionList =
      domainQuestions[domain as keyof typeof domainQuestions];
    if (domainQuestionList) {
      domainQuestionList.forEach((question) => {
        questions.push({ question, category: domain });
      });
    }
  });

  return questions;
};

export const getRoleQuestions = (domain: string) => {
  const availableRoles = rolesData[domain as keyof typeof rolesData] || [];
  const questions: Array<{ question: string; category: string }> = [];

  availableRoles.forEach((role) => {
    const roleQuestionList = roleQuestions[role as keyof typeof roleQuestions];
    if (roleQuestionList) {
      roleQuestionList.forEach((question) => {
        questions.push({ question, category: role });
      });
    }
  });

  return questions;
};
