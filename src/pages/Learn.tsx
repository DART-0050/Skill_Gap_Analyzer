import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  BookOpen,
  ExternalLink,
  CheckCircle,
  ArrowLeft,
  Search,
  Target,
  TrendingUp,
  Star,
  Filter,
} from "lucide-react";
import { getStoredUser, setStoredUser } from "../lib/auth";
import { getUserData, getSkillResources, markSkillAsLearned } from "../lib/api";
import { User } from "../lib/types";
import fullRoleSkills from "../data/full_role_skills.json";

interface LearningResource {
  skill: string;
  title: string;
  url: string;
  description: string;
  completed: boolean;
  category: string;
}

export default function Learn() {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loadUserData = async () => {
      const userData = await getUserData(storedUser.email);
      if (userData) {
        setUser(userData);
        if (!userData.quiz_completed) {
          navigate("/quiz");
          return;
        }
        generateLearningResources(userData);
      }
    };

    loadUserData();
  }, [navigate]);

  const generateLearningResources = (userData: User) => {
    if (!userData.predicted_role) return;

    const requiredSkills =
      fullRoleSkills[userData.predicted_role as keyof typeof fullRoleSkills] ||
      [];
    const userSkills = [...userData.known_skills, ...userData.learned_skills];
    const missingSkills = requiredSkills.filter(
      (skill) => !userSkills.includes(skill),
    );

    const learningResources: LearningResource[] = [];

    // Add resources for missing skills
    missingSkills.forEach((skill) => {
      const resource = getSkillResources(skill);
      if (resource) {
        learningResources.push({
          skill,
          title: resource.title,
          url: resource.url,
          description: resource.description || `Learn ${skill} effectively`,
          completed: false,
          category: categorizeSkill(skill),
        });
      }
    });

    // Add some additional recommended resources
    const additionalSkills = [
      "Git",
      "Problem Solving",
      "Communication",
      "Teamwork",
      "Project Management",
    ];

    additionalSkills.forEach((skill) => {
      if (!userSkills.includes(skill)) {
        const resource = getSkillResources(skill);
        if (resource) {
          learningResources.push({
            skill,
            title: resource.title,
            url: resource.url,
            description: resource.description || `Enhance your ${skill} skills`,
            completed: false,
            category: "Soft Skills",
          });
        }
      }
    });

    setResources(learningResources);
  };

  const categorizeSkill = (skill: string): string => {
    const categories = {
      "Programming Languages": [
        "JavaScript",
        "Python",
        "Java",
        "TypeScript",
        "C++",
        "C#",
        "Go",
        "Rust",
        "PHP",
        "Swift",
        "Kotlin",
      ],
      "Web Development": [
        "React.js",
        "Vue.js",
        "Angular",
        "Node.js",
        "HTML",
        "CSS",
        "Express.js",
        "Next.js",
        "Tailwind CSS",
        "Bootstrap",
      ],
      "Data Science": [
        "Machine Learning",
        "Data Analysis",
        "Statistics",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "TensorFlow",
        "PyTorch",
        "SQL",
        "Data Visualization",
      ],
      "Cloud & DevOps": [
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Linux",
        "Bash",
        "Terraform",
        "Jenkins",
        "Monitoring",
      ],
      "Design & UX": [
        "Figma",
        "Adobe XD",
        "Design Thinking",
        "User Research",
        "Wireframing",
        "Prototyping",
        "Usability Testing",
      ],
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill)) {
        return category;
      }
    }

    return "General";
  };

  const handleMarkAsLearned = async (skill: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await markSkillAsLearned(user.email, skill);

      // Update local user state
      const updatedUser = {
        ...user,
        learned_skills: [...user.learned_skills, skill],
      };
      setUser(updatedUser);
      setStoredUser(updatedUser);

      // Update resources
      setResources((prev) =>
        prev.map((resource) =>
          resource.skill === skill
            ? { ...resource, completed: true }
            : resource,
        ),
      );
    } catch (error) {
      console.error("Error marking skill as learned:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || resource.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(resources.map((r) => r.category))];

  const completedCount = resources.filter((r) => r.completed).length;
  const progressPercentage =
    resources.length > 0 ? (completedCount / resources.length) * 100 : 0;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-skillpath-bg">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 text-skillpath-text-muted hover:text-skillpath-text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-bold text-skillpath-text-secondary mb-2">
              Learning Resources
            </h1>
            <p className="text-skillpath-text-muted">
              Curated learning paths tailored to your role:{" "}
              <span className="text-purple-400 font-semibold">
                {user.predicted_role}
              </span>
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="bg-skillpath-surface border-skillpath-border mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-skillpath-text-secondary mb-1">
                    {resources.length}
                  </div>
                  <div className="text-sm text-skillpath-text-muted">
                    Total Resources
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {completedCount}
                  </div>
                  <div className="text-sm text-skillpath-text-muted">
                    Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-skillpath-text-muted">
                    Progress
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card className="bg-skillpath-surface border-skillpath-border mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-skillpath-text-muted" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-skillpath-bg border-skillpath-border text-skillpath-text-primary"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-skillpath-text-muted" />
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          filterCategory === category ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setFilterCategory(category)}
                        className={
                          filterCategory === category
                            ? "bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground"
                            : "border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-bg"
                        }
                      >
                        {category === "all" ? "All" : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          {filteredResources.length === 0 ? (
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 text-skillpath-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                  No resources found
                </h3>
                <p className="text-skillpath-text-muted">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your search or filter"
                    : "Complete your skill gap analysis to get personalized recommendations"}
                </p>
                {!searchTerm && filterCategory === "all" && (
                  <Link to="/skill-gap" className="mt-4 inline-block">
                    <Button className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground">
                      <Target className="w-4 h-4 mr-2" />
                      Analyze Skills
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredResources.map((resource, index) => (
                <Card
                  key={index}
                  className={`bg-skillpath-surface border-skillpath-border ${
                    resource.completed
                      ? "border-green-500/30 bg-green-500/5"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                          >
                            {resource.skill}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-skillpath-border text-skillpath-text-muted"
                          >
                            {resource.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-skillpath-text-secondary">
                          {resource.title}
                        </CardTitle>
                      </div>
                      {resource.completed && (
                        <div className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">Completed</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-skillpath-text-muted mb-4">
                      {resource.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-bg hover:border-purple-500 flex items-center space-x-2"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit Resource</span>
                      </Button>
                      {!resource.completed ? (
                        <Button
                          onClick={() => handleMarkAsLearned(resource.skill)}
                          disabled={isLoading}
                          className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Learned
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="bg-green-500/20 text-green-400 border-green-500/30 cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Motivation Section */}
          {resources.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 mt-8">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                  Keep Learning!
                </h3>
                <p className="text-skillpath-text-muted mb-4">
                  Every skill you master brings you closer to your dream job as
                  a {user.predicted_role}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-skillpath-text-secondary">
                    {completedCount} skills completed
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
