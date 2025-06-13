import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  BookOpen,
  Zap,
} from "lucide-react";
import { Navigation } from "../components/Navigation";

export default function Index() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Career Discovery",
      description:
        "Advanced ML models analyze your responses to predict your ideal tech role with precision.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Skill Gap Analysis",
      description:
        "Upload your resume or manually select skills to identify exactly what you need to learn.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Curated Learning Paths",
      description:
        "Get personalized learning resources from top platforms tailored to your missing skills.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey and watch your job readiness percentage increase.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Take the Career Quiz",
      description:
        "Answer questions about your interests and experience across different tech domains.",
    },
    {
      number: "02",
      title: "Get Your Role Prediction",
      description:
        "Our AI analyzes your responses to predict your ideal tech career path.",
    },
    {
      number: "03",
      title: "Analyze Skill Gaps",
      description:
        "Upload your resume or manually select skills to see what you need to learn.",
    },
    {
      number: "04",
      title: "Start Learning",
      description:
        "Follow curated learning paths and track your progress toward job readiness.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Now Data Scientist at Google",
      content:
        "SkillPath AI helped me transition from marketing to data science. The personalized learning path was spot-on!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer at Stripe",
      content:
        "The career quiz revealed my passion for full-stack development. Within 6 months, I landed my dream job.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "DevOps Engineer at Netflix",
      content:
        "The skill gap analysis was incredibly accurate. It showed me exactly what to focus on for DevOps roles.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-skillpath-bg text-skillpath-text-primary">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-skillpath-surface border border-skillpath-border mb-6">
              <Zap className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm text-skillpath-text-muted">
                AI-Powered Career Discovery
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-skillpath-text-secondary mb-6">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Perfect Tech Career
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-skillpath-text-muted max-w-3xl mx-auto mb-8">
              Use AI to identify your ideal tech role, analyze skill gaps, and
              get personalized learning paths to become job-ready faster than
              ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground px-8 py-3 text-lg"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-skillpath-border text-skillpath-text-primary hover:bg-skillpath-surface px-8 py-3 text-lg"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-skillpath-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-skillpath-text-secondary mb-2">
                10K+
              </div>
              <div className="text-skillpath-text-muted">
                Career Discoveries
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-skillpath-text-secondary mb-2">
                95%
              </div>
              <div className="text-skillpath-text-muted">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-skillpath-text-secondary mb-2">
                500+
              </div>
              <div className="text-skillpath-text-muted">Tech Roles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-skillpath-text-secondary mb-2">
                1000+
              </div>
              <div className="text-skillpath-text-muted">
                Learning Resources
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-skillpath-text-secondary mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-skillpath-text-muted max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with curated learning
              resources to accelerate your tech career.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-skillpath-surface border-skillpath-border hover:border-purple-500/50 transition-colors group"
              >
                <CardContent className="p-6">
                  <div className="text-purple-400 group-hover:text-purple-300 transition-colors mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-skillpath-text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-skillpath-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-skillpath-text-secondary mb-4">
              How SkillPath AI Works
            </h2>
            <p className="text-lg text-skillpath-text-muted max-w-2xl mx-auto">
              Four simple steps to discover your ideal tech career and become
              job-ready.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-skillpath-button-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-3">
                  {step.title}
                </h3>
                <p className="text-skillpath-text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-skillpath-text-secondary mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-skillpath-text-muted max-w-2xl mx-auto">
              See how SkillPath AI has helped thousands discover and achieve
              their dream tech careers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-skillpath-surface border-skillpath-border"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-skillpath-text-muted mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-skillpath-text-secondary">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-skillpath-text-muted">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-t border-skillpath-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-skillpath-text-secondary mb-6">
            Ready to Discover Your Tech Future?
          </h2>
          <p className="text-lg text-skillpath-text-muted mb-8">
            Join thousands of professionals who have found their perfect tech
            career with SkillPath AI.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground px-8 py-3 text-lg"
            >
              Start Your Career Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-skillpath-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-skillpath-button-primary">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-skillpath-text-secondary">
                SkillPath AI
              </span>
            </div>
            <div className="text-skillpath-text-muted text-sm">
              © 2024 SkillPath AI. Empowering tech careers with AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
