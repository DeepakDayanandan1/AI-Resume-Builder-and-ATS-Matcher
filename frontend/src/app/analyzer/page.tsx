"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2, AlertTriangle, XCircle, Lightbulb, BarChart3 } from "lucide-react";
import type { ATSAnalysis } from "@/types";
import { analyzeResume } from "@/lib/api";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSAnalysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else toast.error("Please upload a PDF file");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeResume(file);
      setResult(data);
      toast.success("Analysis complete!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            ATS <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-muted-foreground mt-1">Upload your resume PDF to get an instant ATS compatibility score.</p>
        </div>

        {/* Upload Area */}
        <Card className="border-white/10 bg-white/5 mb-8">
          <CardContent className="p-8">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-white/20 p-12 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">{file.name}</span>
                  <Badge variant="secondary">{(file.size / 1024).toFixed(0)} KB</Badge>
                </div>
              ) : (
                <>
                  <p className="font-medium mb-1">Drop your resume PDF here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports PDF format up to 10MB</p>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <Button onClick={handleAnalyze} disabled={!file || loading} className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 shadow-lg shadow-purple-500/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Card */}
            <Card className="border-white/10 bg-white/5 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${getScoreGradient(result.ats_score)}`} />
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative h-40 w-40 shrink-0">
                    <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
                      <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${result.ats_score * 2.64} ${100 * 2.64}`} className={getScoreColor(result.ats_score)} stroke="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(result.ats_score)}`}>{Math.round(result.ats_score)}%</span>
                      <span className="text-xs text-muted-foreground">ATS Score</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold mb-2">
                      {result.ats_score >= 80 ? "Excellent!" : result.ats_score >= 60 ? "Good, but can improve" : "Needs Improvement"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {result.ats_score >= 80
                        ? "Your resume is well-optimized for ATS systems."
                        : result.ats_score >= 60
                        ? "Your resume passes basic ATS checks but has room for improvement."
                        : "Your resume may not pass ATS filters. Follow the suggestions below."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections Found */}
            <Card className="border-white/10 bg-white/5">
              <CardHeader><CardTitle className="text-lg">Sections Check</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(result.sections_found).map(([section, found]) => (
                    <div key={section} className="flex items-center gap-2 text-sm">
                      {found ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                      <span className={found ? "text-foreground" : "text-muted-foreground"}>{section.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issues & Suggestions */}
            <div className="grid gap-6 sm:grid-cols-2">
              {result.formatting_issues.length > 0 && (
                <Card className="border-white/10 bg-white/5">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-400" />Issues</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.formatting_issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-amber-400 mt-0.5">⚠</span>{issue}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {result.suggestions.length > 0 && (
                <Card className="border-white/10 bg-white/5">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="h-4 w-4 text-cyan-400" />Suggestions</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-cyan-400 mt-0.5">→</span>{s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Keywords */}
            {result.keyword_density.technical_skills && result.keyword_density.technical_skills.length > 0 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-lg">Skills Found</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.keyword_density.technical_skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
