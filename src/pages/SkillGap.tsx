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
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Upload,
  CheckSquare,
  ArrowLeft,
  FileText,
  Search,
  Target,
  Brain,
  Zap,
  Loader2,
} from "lucide-react";
import { getStoredUser } from "../lib/auth";
import { getUserData, analyzeSkillGap } from "../lib/api";
import { User } from "../lib/types";
import fullRoleSkills from "../data/full_role_skills.json";

type AnalysisMode = "none" | "resume" | "manual";

interface SkillCategory {
  name: string;
  skills: string[];
}

export default function SkillGap() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AnalysisMode>("none");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const navigate = useNavigate();

  // All available skills categorized
  const skillCategories: SkillCategory[] = [
    {
      name: "Programming Languages",
      skills: [
        "JavaScript",
        "Python",
        "Java",
        "TypeScript",
        "C++",
        "C#",
        "Ruby",
        "Go",
        "Rust",
        "PHP",
        "Swift",
        "Kotlin",
        "Dart",
        "SQL",
        "R",
      ],
    },
    {
      name: "Web Development",
      skills: [
        "HTML",
        "CSS",
        "React.js",
        "Vue.js",
        "Angular",
        "Node.js",
        "Express.js",
        "Next.js",
        "Svelte",
        "jQuery",
        "Bootstrap",
        "Tailwind CSS",
        "Sass",
        "Webpack",
        "Vite",
      ],
    },
    {
      name: "Mobile Development",
      skills: [
        "React Native",
        "Flutter",
        "iOS Development",
        "Android Development",
        "Expo",
        "Xamarin",
        "Ionic",
        "SwiftUI",
        "Jetpack Compose",
      ],
    },
    {
      name: "Data Science & ML",
      skills: [
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "PyTorch",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Keras",
        "Data Analysis",
        "Statistics",
        "Data Visualization",
        "Jupyter",
        "Apache Spark",
        "Hadoop",
      ],
    },
    {
      name: "Cloud & DevOps",
      skills: [
        "AWS",
        "Google Cloud",
        "Microsoft Azure",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "GitLab CI",
        "GitHub Actions",
        "Terraform",
        "Ansible",
        "Linux",
        "Bash",
        "PowerShell",
        "Monitoring",
      ],
    },
    {
      name: "Databases",
      skills: [
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "Elasticsearch",
        "DynamoDB",
        "Cassandra",
        "SQLite",
        "Oracle",
        "SQL Server",
        "Firebase",
      ],
    },
    {
      name: "Design & UX",
      skills: [
        "Figma",
        "Adobe XD",
        "Sketch",
        "Photoshop",
        "Illustrator",
        "Design Thinking",
        "User Research",
        "Wireframing",
        "Prototyping",
        "Usability Testing",
        "Typography",
        "Color Theory",
      ],
    },
    {
      name: "Tools & Others",
      skills: [
        "Git",
        "GitHub",
        "GitLab",
        "Jira",
        "Slack",
        "Notion",
        "Postman",
        "VS Code",
        "IntelliJ",
        "Vim",
        "API Development",
        "REST APIs",
        "GraphQL",
        "WebSocket",
        "Microservices",
      ],
    },
  ];

  const allSkills = skillCategories.flatMap((category) => category.skills);

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
        }
      }
    };

    loadUserData();
  }, [navigate]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setUploadedFile(file);
    setIsExtracting(true);

    try {
      // Simulate PDF text extraction and skill detection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock extracted skills based on file name or random selection
      const mockExtractedSkills = [
        "JavaScript",
        "React.js",
        "Node.js",
        "Python",
        "SQL",
        "Git",
        "AWS",
        "Docker",
      ];

      setExtractedSkills(mockExtractedSkills);
      setSelectedSkills(mockExtractedSkills);
    } catch (error) {
      console.error("Error extracting skills:", error);
      alert("Error processing resume. Please try manual selection.");
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const filteredSkills = allSkills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const analyzeSkills = async () => {
    if (!user?.predicted_role || selectedSkills.length === 0) return;

    setIsAnalyzing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = analyzeSkillGap(selectedSkills, user.predicted_role);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const requiredSkillsForRole =
    user?.predicted_role &&
    fullRoleSkills[user.predicted_role as keyof typeof fullRoleSkills]
      ? fullRoleSkills[user.predicted_role as keyof typeof fullRoleSkills]
      : [];

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
              Skill Gap Analysis
            </h1>
            <p className="text-skillpath-text-muted">
              Analyze your current skills against your predicted role:{" "}
              <span className="text-purple-400 font-semibold">
                {user.predicted_role}
              </span>
            </p>
          </div>

          {mode === "none" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume Upload Option */}
              <Card className="bg-skillpath-surface border-skillpath-border hover:border-purple-500/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-skillpath-text-secondary flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-purple-400" />
                    <span>Upload Resume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="text-center py-8"
                  onClick={() => setMode("resume")}
                >
                  <div className="border-2 border-dashed border-skillpath-border rounded-lg p-8 hover:border-purple-500/50 transition-colors">
                    <FileText className="w-12 h-12 text-skillpath-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                      Extract Skills from Resume
                    </h3>
                    <p className="text-skillpath-text-muted mb-4">
                      Upload your PDF resume and we'll automatically extract
                      your skills
                    </p>
                    <Button className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground">
                      Choose Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Selection Option */}
              <Card className="bg-skillpath-surface border-skillpath-border hover:border-purple-500/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-skillpath-text-secondary flex items-center space-x-2">
                    <CheckSquare className="w-5 h-5 text-purple-400" />
                    <span>Manual Selection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="text-center py-8"
                  onClick={() => setMode("manual")}
                >
                  <div className="p-8">
                    <CheckSquare className="w-12 h-12 text-skillpath-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                      Select Your Skills
                    </h3>
                    <p className="text-skillpath-text-muted mb-4">
                      Browse and manually select your skills from our
                      comprehensive list
                    </p>
                    <Button
                      variant="outline"
                      className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-bg hover:border-purple-500"
                    >
                      Choose Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {mode === "resume" && (
            <div className="space-y-6">
              <Card className="bg-skillpath-surface border-skillpath-border">
                <CardHeader>
                  <CardTitle className="text-skillpath-text-secondary flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Resume Upload</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!uploadedFile ? (
                    <div className="border-2 border-dashed border-skillpath-border rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-skillpath-text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                        Upload Your Resume
                      </h3>
                      <p className="text-skillpath-text-muted mb-4">
                        Support for PDF files only
                      </p>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  ) : isExtracting ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                      <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                        Extracting Skills...
                      </h3>
                      <p className="text-skillpath-text-muted">
                        Analyzing your resume with AI
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Alert className="border-green-500/50 bg-green-500/10 mb-4">
                        <AlertDescription className="text-green-400">
                          ✅ Successfully extracted {extractedSkills.length}{" "}
                          skills from your resume
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-skillpath-text-secondary">
                          Extracted Skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {extractedSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-4">
                          <Button
                            onClick={analyzeSkills}
                            disabled={isAnalyzing}
                            className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Analyze Skills
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setMode("none");
                              setUploadedFile(null);
                              setExtractedSkills([]);
                              setSelectedSkills([]);
                            }}
                            className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-bg"
                          >
                            Try Different Method
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {mode === "manual" && (
            <div className="space-y-6">
              <Card className="bg-skillpath-surface border-skillpath-border">
                <CardHeader>
                  <CardTitle className="text-skillpath-text-secondary flex items-center space-x-2">
                    <CheckSquare className="w-5 h-5" />
                    <span>Select Your Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-skillpath-text-muted" />
                        <Input
                          placeholder="Search skills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-skillpath-bg border-skillpath-border text-skillpath-text-primary"
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-skillpath-border"
                      >
                        {selectedSkills.length} selected
                      </Badge>
                    </div>

                    {searchTerm ? (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-skillpath-text-secondary">
                          Search Results:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {filteredSkills.map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center space-x-2 p-2 rounded hover:bg-skillpath-bg cursor-pointer"
                              onClick={() => toggleSkill(skill)}
                            >
                              <Checkbox
                                checked={selectedSkills.includes(skill)}
                                onChange={() => toggleSkill(skill)}
                              />
                              <span className="text-sm text-skillpath-text-primary">
                                {skill}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {skillCategories.map((category) => (
                          <div key={category.name}>
                            <h4 className="font-semibold text-skillpath-text-secondary mb-3">
                              {category.name}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {category.skills.map((skill) => (
                                <div
                                  key={skill}
                                  className="flex items-center space-x-2 p-2 rounded hover:bg-skillpath-bg cursor-pointer"
                                  onClick={() => toggleSkill(skill)}
                                >
                                  <Checkbox
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => toggleSkill(skill)}
                                  />
                                  <span className="text-sm text-skillpath-text-primary">
                                    {skill}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-4 pt-4 border-t border-skillpath-border">
                      <Button
                        onClick={analyzeSkills}
                        disabled={selectedSkills.length === 0 || isAnalyzing}
                        className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Analyze Skills ({selectedSkills.length})
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMode("none");
                          setSelectedSkills([]);
                          setSearchTerm("");
                        }}
                        className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-bg"
                      >
                        Try Different Method
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {analysisResult && (
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader>
                <CardTitle className="text-skillpath-text-secondary flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Readiness Score */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-skillpath-text-secondary mb-2">
                    {analysisResult.readiness_percentage}%
                  </div>
                  <p className="text-skillpath-text-muted mb-4">Job Ready</p>
                  <Progress value={analysisResult.readiness_percentage} />
                </div>

                {/* Skills Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched Skills */}
                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                      <CheckSquare className="w-5 h-5 mr-2" />
                      Matched Skills ({analysisResult.matched_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matched_skills.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Skills to Learn ({analysisResult.missing_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missing_skills.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-red-500/20 text-red-400 border-red-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-skillpath-border">
                  <Link to="/learn">
                    <Button className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground">
                      <Brain className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAnalysisResult(null);
                      setMode("none");
                      setSelectedSkills([]);
                      setUploadedFile(null);
                      setExtractedSkills([]);
                    }}
                    className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-bg"
                  >
                    Analyze Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Required Skills for Role */}
          {requiredSkillsForRole.length > 0 && !analysisResult && (
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader>
                <CardTitle className="text-skillpath-text-secondary">
                  Required Skills for {user.predicted_role}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {requiredSkillsForRole.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-skillpath-border text-skillpath-text-muted"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
