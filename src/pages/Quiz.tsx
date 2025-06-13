import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Navigation } from "../components/Navigation";
import { getStoredUser, setStoredUser } from "../lib/auth";
import { updateUserQuizResult, getUserData } from "../lib/api";
import {
  QuizEngine,
  createClusterQuiz,
  createDomainQuiz,
  createRoleQuiz,
} from "../lib/quiz-engine";
import { User } from "../lib/types";
import { Brain, CheckCircle, Loader2, ArrowRight, Star } from "lucide-react";

type QuizStage = "cluster" | "domain" | "role" | "complete";
type QuizState =
  | "asking"
  | "processing"
  | "tie-break"
  | "confirmation"
  | "stage-complete";

export default function Quiz() {
  const [currentStage, setCurrentStage] = useState<QuizStage>("cluster");
  const [quizState, setQuizState] = useState<QuizState>("asking");
  const [quizEngine, setQuizEngine] = useState<QuizEngine | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    label: string;
  } | null>(null);

  const [predictions, setPredictions] = useState({
    cluster: "",
    domain: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tieBreakInfo, setTieBreakInfo] = useState<{
    labels: string[];
    round: number;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // Load complete user data
    const loadUserData = async () => {
      const userData = await getUserData(storedUser.email);
      if (userData) {
        setUser(userData);
        if (userData.quiz_completed) {
          navigate("/dashboard");
          return;
        }
      }
    };

    loadUserData();
    initializeQuiz();
  }, [navigate]);

  const initializeQuiz = () => {
    const engine = createClusterQuiz();
    setQuizEngine(engine);
    setCurrentQuestion(engine.getCurrentQuestion());
    setQuizState("asking");
  };

  const handleAnswer = async (answer: "yes" | "no" | "not sure") => {
    if (!quizEngine || !currentQuestion) return;

    setIsLoading(true);

    try {
      let result;

      if (quizState === "confirmation") {
        // Handle confirmation question
        result = await quizEngine.processConfirmationAnswer(
          answer,
          currentQuestion.label,
        );

        if (result.isComplete) {
          await completeStage(result.prediction);
        }
      } else {
        // Handle regular question
        result = await quizEngine.answerQuestion(answer);

        if (result.isComplete && result.prediction) {
          // Stage complete
          await completeStage(result.prediction);
        } else if (result.needsTieBreak && result.tiedLabels) {
          // Tie-break needed
          setQuizState("tie-break");
          setTieBreakInfo({
            labels: result.tiedLabels,
            round: (tieBreakInfo?.round || 0) + 1,
          });
          setCurrentQuestion(result.nextQuestion || null);
        } else if (result.confirmationQuestion) {
          // Confirmation question
          setQuizState("confirmation");
          setCurrentQuestion(result.confirmationQuestion);
        } else if (result.nextQuestion) {
          // Next regular question
          setCurrentQuestion(result.nextQuestion);
          setQuizState("asking");
        }
      }
    } catch (error) {
      console.error("Quiz error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeStage = async (prediction: string) => {
    // Update predictions
    const newPredictions = { ...predictions };
    newPredictions[currentStage] = prediction;
    setPredictions(newPredictions);

    setQuizState("stage-complete");

    // Show stage result for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Move to next stage or complete
    if (currentStage === "cluster") {
      setCurrentStage("domain");
      const domainEngine = createDomainQuiz(prediction);
      setQuizEngine(domainEngine);
      setCurrentQuestion(domainEngine.getCurrentQuestion());
      setQuizState("asking");
      setTieBreakInfo(null);
    } else if (currentStage === "domain") {
      setCurrentStage("role");
      const roleEngine = createRoleQuiz(prediction);
      setQuizEngine(roleEngine);
      setCurrentQuestion(roleEngine.getCurrentQuestion());
      setQuizState("asking");
      setTieBreakInfo(null);
    } else if (currentStage === "role") {
      // Complete entire quiz
      await finalizeQuiz(newPredictions);
    }
  };

  const finalizeQuiz = async (finalPredictions: typeof predictions) => {
    if (user) {
      await updateUserQuizResult(user.email, {
        cluster: finalPredictions.cluster,
        domain: finalPredictions.domain,
        role: finalPredictions.role,
      });

      // Update stored user
      const updatedUser = { ...user, quiz_completed: true };
      setStoredUser(updatedUser);

      setCurrentStage("complete");

      // Navigate to dashboard after delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  };

  const getOverallProgress = () => {
    const stages = ["cluster", "domain", "role"];
    const currentStageIndex = stages.indexOf(currentStage);

    if (currentStage === "complete") return 100;

    // Base progress for completed stages
    const completedStageProgress = (currentStageIndex / stages.length) * 100;

    // Progress within current stage
    if (quizEngine) {
      const totalQuestions = quizEngine.getTotalQuestions();
      const currentQuestionIndex = quizEngine.getCurrentQuestionIndex();
      const stageProgress =
        totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0;
      const stageContribution = (1 / stages.length) * stageProgress;

      return completedStageProgress + stageContribution;
    }

    return completedStageProgress;
  };

  const getStageTitle = () => {
    if (currentStage === "cluster")
      return "Stage 1: Discover Your Tech Cluster";
    if (currentStage === "domain") return "Stage 2: Find Your Domain";
    if (currentStage === "role") return "Stage 3: Identify Your Role";
    return "Quiz Complete!";
  };

  const getQuestionContext = () => {
    if (quizState === "tie-break" && tieBreakInfo) {
      return `Tie-break round ${tieBreakInfo.round} between: ${tieBreakInfo.labels.join(", ")}`;
    }
    if (quizState === "confirmation") {
      return "Final confirmation question";
    }
    if (quizEngine && currentQuestion) {
      return `Question ${quizEngine.getCurrentQuestionIndex() + 1} of ${quizEngine.getTotalQuestions()}`;
    }
    return "";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-skillpath-bg">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-skillpath-text-secondary">
                Career Discovery Quiz
              </h1>
            </div>
            <p className="text-skillpath-text-muted">{getStageTitle()}</p>
          </div>

          <Card className="bg-skillpath-surface border-skillpath-border max-w-2xl mx-auto">
            <CardHeader>
              <div className="space-y-4">
                <Progress value={getOverallProgress()} className="w-full" />
                <div className="text-center text-sm text-skillpath-text-muted">
                  {getQuestionContext()}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoading || quizState === "processing" ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                  <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-2">
                    Processing your response...
                  </h3>
                  <p className="text-skillpath-text-muted">
                    Our AI is analyzing your answer
                  </p>
                </div>
              ) : quizState === "stage-complete" ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-skillpath-text-secondary mb-4">
                    {currentStage === "cluster" && "Cluster Predicted!"}
                    {currentStage === "domain" && "Domain Predicted!"}
                    {currentStage === "role" && "Role Predicted!"}
                  </h3>
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-skillpath-text-muted mb-2">
                      Your{" "}
                      {currentStage.charAt(0).toUpperCase() +
                        currentStage.slice(1)}
                      :
                    </p>
                    <h4 className="text-lg font-bold text-skillpath-text-secondary">
                      {predictions[currentStage]}
                    </h4>
                  </div>
                  <p className="text-skillpath-text-muted">
                    Moving to next stage...
                  </p>
                </div>
              ) : currentStage === "complete" ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-skillpath-text-secondary mb-6">
                    Quiz Complete!
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-skillpath-bg rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-skillpath-text-muted">
                          Cluster:
                        </span>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-lg font-semibold text-skillpath-text-secondary">
                        {predictions.cluster}
                      </p>
                    </div>

                    <div className="bg-skillpath-bg rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-skillpath-text-muted">
                          Domain:
                        </span>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-lg font-semibold text-skillpath-text-secondary">
                        {predictions.domain}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-skillpath-text-muted">
                          Your Role:
                        </span>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-xl font-bold text-skillpath-text-secondary">
                        {predictions.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-skillpath-text-muted mb-4">
                    Redirecting to your dashboard...
                  </p>

                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-skillpath-button-primary hover:bg-skillpath-button-primary-hover text-skillpath-button-primary-foreground"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : currentQuestion ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-skillpath-text-secondary mb-4">
                      {currentQuestion.question}
                    </h3>

                    {quizState === "tie-break" && tieBreakInfo && (
                      <Alert className="border-orange-500/50 bg-orange-500/10 mb-4">
                        <AlertDescription className="text-orange-400">
                          🔄 Tie detected! This question will help determine the
                          best fit.
                        </AlertDescription>
                      </Alert>
                    )}

                    {quizState === "confirmation" && (
                      <Alert className="border-blue-500/50 bg-blue-500/10 mb-4">
                        <AlertDescription className="text-blue-400">
                          ✨ Final confirmation - this helps ensure the best
                          prediction for you!
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3">
                      {["yes", "not sure", "no"].map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          className="w-full justify-start p-4 h-auto border-skillpath-border hover:bg-skillpath-bg hover:border-purple-500 text-left"
                          onClick={() =>
                            handleAnswer(option as "yes" | "no" | "not sure")
                          }
                          disabled={isLoading}
                        >
                          <span className="capitalize text-skillpath-text-primary">
                            {option === "not sure" ? "Not Sure" : option}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Alert className="border-purple-500/50 bg-purple-500/10">
                    <AlertDescription className="text-purple-400">
                      💡 Answer honestly for the most accurate career prediction
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-skillpath-text-muted">
                    Loading questions...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
