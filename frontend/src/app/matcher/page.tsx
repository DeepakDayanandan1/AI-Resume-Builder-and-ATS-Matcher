"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2, XCircle, GitCompare, Target, ArrowRight } from "lucide-react";
import type { JobMatchResult } from "@/types";
import { matchResumeFile } from "@/lib/api";

export default function MatcherPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMatch = async () => {
    if (!file || !jobTitle.trim() || !jobDesc.trim()) {
      toast.error("Please upload a resume and enter a job description");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await matchResumeFile(file, jobTitle, jobDesc);
      setResult(data);
      toast.success("Match analysis complete!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Matching failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => (s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400");
  const barColor = (s: number) => (s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-red-500");

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            JD <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Match Score</span>
          </h1>
          <p className="text-muted-foreground mt-1">Compare your resume against a job description to see how well you match.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-amber-400" />Upload Resume</CardTitle></CardHeader>
              <CardContent>
                <div onClick={() => inputRef.current?.click()} className="cursor-pointer rounded-lg border-2 border-dashed border-white/20 p-6 text-center hover:border-amber-500/50 transition-all">
                  <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
                  {file ? (
                    <div className="flex items-center justify-center gap-2"><FileText className="h-5 w-5 text-amber-400" /><span className="text-sm font-medium">{file.name}</span></div>
                  ) : (
                    <><Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground">Click to upload PDF</p></>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-amber-400" />Job Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Job Title</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" className="mt-1 bg-white/5 border-white/10" /></div>
                <div><Label>Job Description</Label><Textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the full job description here..." rows={8} className="mt-1 bg-white/5 border-white/10" /></div>
              </CardContent>
            </Card>

            <Button onClick={handleMatch} disabled={loading} className="w-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompare className="h-4 w-4" />}
              {loading ? "Analyzing..." : "Compare Match"}
            </Button>
          </div>

          {/* Results */}
          <div>
            {!result && !loading && (
              <Card className="border-white/10 bg-white/5 h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <GitCompare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Upload a resume and enter a job description to see your match score</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Score */}
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6 text-center">
                    <div className="relative h-36 w-36 mx-auto mb-4">
                      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
                        <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${result.match_score * 2.64} ${100 * 2.64}`} stroke="currentColor" className={scoreColor(result.match_score)} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${scoreColor(result.match_score)}`}>{Math.round(result.match_score)}%</span>
                        <span className="text-xs text-muted-foreground">Match Score</span>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 gap-3 text-left">
                      {[
                        { label: "Skill Match", score: result.skill_match_score, weight: "40%" },
                        { label: "Experience", score: result.experience_match_score, weight: "30%" },
                        { label: "Education", score: result.education_match_score, weight: "20%" },
                        { label: "Formatting", score: result.formatting_score, weight: "10%" },
                      ].map((item) => (
                        <div key={item.label} className="text-sm">
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-muted-foreground">{item.label} ({item.weight})</span>
                            <span className={scoreColor(item.score)}>{Math.round(item.score)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full rounded-full ${barColor(item.score)} transition-all duration-1000`} style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Matched Skills */}
                {result.matched_skills.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Matched Skills ({result.matched_skills.length})</CardTitle></CardHeader>
                    <CardContent><div className="flex flex-wrap gap-2">{result.matched_skills.map((s, i) => <Badge key={i} className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">{s}</Badge>)}</div></CardContent>
                  </Card>
                )}

                {/* Missing Skills */}
                {result.missing_skills.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-400" />Missing Skills ({result.missing_skills.length})</CardTitle></CardHeader>
                    <CardContent><div className="flex flex-wrap gap-2">{result.missing_skills.map((s, i) => <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-300 border-red-500/20">{s}</Badge>)}</div></CardContent>
                  </Card>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
                    <CardContent><ul className="space-y-2">{result.suggestions.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><ArrowRight className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />{s}</li>)}</ul></CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
