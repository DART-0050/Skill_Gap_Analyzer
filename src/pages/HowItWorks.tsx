import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Navigation } from "../components/Navigation";
import {
  Brain,
  Target,
  Upload,
  BookOpen,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  FileText,
  BarChart3,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: <Users className="w-8 h-8" />,
      title: "Sign Up & Get Started",
      description:
        "Create your account with just your name, email, and password. It takes less than a minute to get started on your career discovery journey.",
      details: [
        "Quick and secure registration",
        "No credit card required",
        "Instant access to the platform",
      ],
    },
    {
      number: 2,
      icon: <Brain className="w-8 h-8" />,
      title: "Take the AI Career Quiz",
      description:
        "Answer questions about your interests, experience, and preferences. Our ML model analyzes your responses to predict your ideal tech role.",
      details: [
        "Multi-stage quiz (Cluster → Domain → Role)",
        "Yes/No/Not Sure questions",
        "AI-powered role prediction",
        "Based on advanced PyTorch models",
      ],
    },
    {
      number: 3,
      icon: <Target className="w-8 h-8" />,
      title: "View Your Results",
      description:
        "Get your predicted career path with detailed insights about your ideal role, including required skills and job market information.",
      details: [
        "Personalized role prediction",
        "Skill requirements breakdown",
        "Job readiness assessment",
        "Career path visualization",
      ],
    },
    {
      number: 4,
      icon: <Upload className="w-8 h-8" />,
      title: "Analyze Your Skills",
      description:
        "Upload your resume or manually select your current skills. We'll compare them against your target role requirements.",
      details: [
        "Resume upload with PDF extraction",
        "Manual skill selection option",
        "Skill gap identification",
        "Readiness percentage calculation",
      ],
    },
    {
      number: 5,
      icon: <BookOpen className="w-8 h-8" />,
      title: "Get Learning Resources",
      description:
        "Receive curated learning paths tailored to your missing skills. Each resource is hand-picked from top educational platforms.",
      details: [
        "Curated learning resources",
        "Links to top platforms",
        "Skill-specific recommendations",
        "Free and paid options",
      ],
    },
    {
      number: 6,
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Progress",
      description:
        "Mark skills as learned and watch your job readiness percentage increase. Monitor your journey toward becoming job-ready.",
      details: [
        "Progress tracking dashboard",
        "Skill completion tracking",
        "Readiness percentage updates",
        "Learning milestone celebration",
      ],
    },
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Predictions",
      description:
        "Advanced machine learning models trained on industry data to predict your ideal tech career path.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Analysis",
      description:
        "Upload your resume and let our system extract and analyze your current skills automatically.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Skill Gap Visualization",
      description:
        "Clear charts and metrics showing exactly what skills you need to develop for your target role.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Curated Resources",
      description:
        "Hand-picked learning materials from the best educational platforms and industry experts.",
    },
  ];

  return (
    <div className="min-h-screen bg-skillpath-bg">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-skillpath-text-secondary mb-6">
              How SkillPath AI Works
            </h1>
            <p className="text-lg text-skillpath-text-muted max-w-3xl mx-auto">
              Discover your perfect tech career in 6 simple steps. Our
              AI-powered platform guides you from career discovery to job
              readiness.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12 mb-20">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div
                  className={`${
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  } space-y-4`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold">
                      {step.number}
                    </div>
                    <div className="text-blue-400">{step.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-skillpath-text-secondary">
                    {step.title}
                  </h3>
                  <p className="text-skillpath-text-muted text-lg leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-2 text-skillpath-text-muted"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`${
                    index % 2 === 1 ? "lg:col-start-1" : ""
                  } bg-skillpath-surface rounded-lg p-8 border border-skillpath-border`}
                >
                  <div className="text-center">
                    <div className="text-blue-400 mb-4 flex justify-center">
                      {React.cloneElement(step.icon, {
                        className: "w-16 h-16",
                      })}
                    </div>
                    <h4 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                      Step {step.number}
                    </h4>
                    <p className="text-skillpath-text-muted">
                      {step.title.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-skillpath-text-secondary text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-skillpath-surface border-skillpath-border text-center"
                >
                  <CardHeader>
                    <div className="text-blue-400 flex justify-center mb-2">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-skillpath-text-secondary text-lg">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-skillpath-text-muted text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-skillpath-text-secondary mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-skillpath-text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have discovered their perfect
              tech career with SkillPath AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-surface"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
