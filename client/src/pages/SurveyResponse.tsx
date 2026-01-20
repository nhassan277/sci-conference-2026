import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SurveyResponse() {
  const [, params] = useRoute("/survey/:token");
  const token = params?.token || "";

  const { data, isLoading, error } = trpc.survey.getByToken.useQuery({ token }, {
    enabled: !!token,
  });

  const submitMutation = trpc.survey.submit.useMutation();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data?.survey) return;

    // Validate all required questions are answered
    const questions = data.survey.questions as any[];
    const unanswered = questions.filter((q: any) => q.required && !answers[q.id]);

    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions`);
      return;
    }

    try {
      await submitMutation.mutateAsync({
        token,
        answers,
      });

      setSubmitted(true);
      toast.success("Survey submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit survey");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading survey...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Survey Not Found</h2>
                <p className="text-muted-foreground">
                  {error?.message || "This survey link is invalid or has expired."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.alreadyResponded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Already Submitted</h2>
                <p className="text-muted-foreground">
                  You have already responded to this survey. Thank you for your feedback!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
                <p className="text-muted-foreground">
                  Your feedback has been submitted successfully. We appreciate your time!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = data.survey.questions as any[];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{data.survey.title}</CardTitle>
            {data.survey.description && (
              <CardDescription className="text-base">{data.survey.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question: any, index: number) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    {index + 1}. {question.text}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  {question.type === "text" && (
                    <Textarea
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      placeholder="Your answer..."
                      rows={4}
                      required={question.required}
                    />
                  )}

                  {question.type === "rating" && (
                    <RadioGroup
                      value={answers[question.id]?.toString() || ""}
                      onValueChange={(value) => setAnswers({ ...answers, [question.id]: parseInt(value) })}
                      required={question.required}
                    >
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                            <Label htmlFor={`${question.id}-${rating}`}>{rating}</Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        1 = Poor, 5 = Excellent
                      </p>
                    </RadioGroup>
                  )}

                  {question.type === "multiple_choice" && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                      required={question.required}
                    >
                      {question.options?.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                          <Label htmlFor={`${question.id}-${optIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "yes_no" && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                      required={question.required}
                    >
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                          <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${question.id}-no`} />
                          <Label htmlFor={`${question.id}-no`}>No</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={submitMutation.isPending}>
                  {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Survey
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
