import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Navigation } from "../components/Navigation";
import { getStoredUser } from "../lib/auth";
import { getUserData, analyzeSkillGap } from "../lib/api";
import { User } from "../lib/types";
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Upload,
  CheckSquare,
  ArrowRight,
  Star,
  Layers,
  Briefcase,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate("/login");
      return;
    }

    if (!storedUser.quiz_completed) {
      navigate("/quiz");
      return;
    }

    const loadUserData = async () => {
      const userData = await getUserData(storedUser.email);
      if (userData) {
        setUser(userData);

        // Analyze skill gap
        const allSkills = [
          ...userData.known_skills,
          ...userData.learned_skills,
        ];
        if (userData.predicted_role) {
          const gap = analyzeSkillGap(allSkills, userData.predicted_role);
          setSkillGap(gap);
        }
      }
    };

    loadUserData();
  }, [navigate]);

  if (!user || !user.predicted_role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-skillpath-bg">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-skillpath-text-secondary mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-skillpath-text-muted">
              Track your progress toward becoming job-ready in your predicted
              role
            </p>
          </div>

          {/* Career Path Results */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Cluster */}
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-skillpath-text-muted">
                  Your Cluster
                </CardTitle>
                <Layers className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-skillpath-text-secondary">
                  {user.predicted_cluster}
                </div>
                <p className="text-xs text-skillpath-text-muted mt-1">
                  Tech specialization area
                </p>
              </CardContent>
            </Card>

            {/* Domain */}
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-skillpath-text-muted">
                  Your Domain
                </CardTitle>
                <Briefcase className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-skillpath-text-secondary">
                  {user.predicted_domain}
                </div>
                <p className="text-xs text-skillpath-text-muted mt-1">
                  Field of expertise
                </p>
              </CardContent>
            </Card>

            {/* Role */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-skillpath-text-secondary">
                  Your Ideal Role
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-skillpath-text-secondary">
                  {user.predicted_role}
                </div>
                <p className="text-xs text-skillpath-text-muted mt-1">
                  Perfect career match
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Readiness Percentage */}
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-skillpath-text-muted">
                  Job Readiness
                </CardTitle>
                <Target className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-skillpath-text-secondary mb-2">
                  {skillGap?.readiness_percentage || 0}%
                </div>
                <Progress
                  value={skillGap?.readiness_percentage || 0}
                  className="mb-2"
                />
                <p className="text-xs text-skillpath-text-muted">
                  Based on your current skills vs role requirements
                </p>
              </CardContent>
            </Card>

            {/* Skills Learned */}
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-skillpath-text-muted">
                  Learning Progress
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-skillpath-text-secondary mb-2">
                  {user.learned_skills.length}
                </div>
                <p className="text-sm text-skillpath-text-muted">
                  Skills mastered
                </p>
                <p className="text-xs text-skillpath-text-muted mt-1">
                  {user.known_skills.length} skills already known
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Skills Overview */}
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader>
                <CardTitle className="text-skillpath-text-secondary">
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillGap?.matched_skills &&
                  skillGap.matched_skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Matched Skills ({skillGap.matched_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.matched_skills
                          .slice(0, 6)
                          .map((skill: string) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {skillGap.matched_skills.length > 6 && (
                          <Badge
                            variant="outline"
                            className="border-skillpath-border"
                          >
                            +{skillGap.matched_skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {skillGap?.missing_skills &&
                  skillGap.missing_skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Skills to Learn ({skillGap.missing_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.missing_skills
                          .slice(0, 6)
                          .map((skill: string) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-red-500/20 text-red-400 border-red-500/30"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {skillGap.missing_skills.length > 6 && (
                          <Badge
                            variant="outline"
                            className="border-skillpath-border"
                          >
                            +{skillGap.missing_skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {user.learned_skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-purple-400 mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Recently Learned ({user.learned_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.learned_skills.slice(0, 6).map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {user.learned_skills.length > 6 && (
                        <Badge
                          variant="outline"
                          className="border-skillpath-border"
                        >
                          +{user.learned_skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-skillpath-surface border-skillpath-border">
              <CardHeader>
                <CardTitle className="text-skillpath-text-secondary">
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/skill-gap">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-skillpath-border hover:bg-skillpath-bg hover:border-purple-500"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze Skill Gap
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>

                <Link to="/learn">
                  <Button className="w-full justify-start bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>

                <Link to="/quiz">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-skillpath-border hover:bg-skillpath-bg hover:border-orange-500 text-orange-400"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Quiz
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Career Path Summary */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 mt-8">
            <CardHeader>
              <CardTitle className="text-skillpath-text-secondary flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Your AI-Predicted Career Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Layers className="w-8 h-8 text-blue-400 mx-auto" />
                  <h4 className="font-semibold text-skillpath-text-secondary">
                    Cluster
                  </h4>
                  <p className="text-sm text-skillpath-text-muted">
                    {user.predicted_cluster}
                  </p>
                </div>
                <div className="space-y-2">
                  <Briefcase className="w-8 h-8 text-purple-400 mx-auto" />
                  <h4 className="font-semibold text-skillpath-text-secondary">
                    Domain
                  </h4>
                  <p className="text-sm text-skillpath-text-muted">
                    {user.predicted_domain}
                  </p>
                </div>
                <div className="space-y-2">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto" />
                  <h4 className="font-semibold text-skillpath-text-secondary">
                    Role
                  </h4>
                  <p className="text-sm text-skillpath-text-muted">
                    {user.predicted_role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
