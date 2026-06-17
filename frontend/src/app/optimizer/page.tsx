"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, Loader2, Sparkles, ArrowUp, Copy, Target, ArrowRight, Zap } from "lucide-react";
import type { OptimizeResult } from "@/types";
import { optimizeResumeFile } from "@/lib/api";

export default function OptimizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOptimize = async () => {
    if (!file || !jobTitle.trim() || !jobDesc.trim()) {
      toast.error("Please provide all inputs");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await optimizeResumeFile(file, jobTitle, jobDesc);
      setResult(data);
      toast.success("Optimization complete!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Optimization failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const impactColor = (impact: string) => {
    if (impact.toLowerCase() === "high") return "bg-red-500/10 text-red-300 border-red-500/20";
    if (impact.toLowerCase() === "medium") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Resume <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Optimizer</span>
          </h1>
          <p className="text-muted-foreground mt-1">Get AI-powered suggestions to boost your resume&apos;s ATS score.</p>
        </div>

        {/* Input Section */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Resume PDF</Label>
              <div onClick={() => inputRef.current?.click()} className="cursor-pointer rounded-lg border-2 border-dashed border-white/20 p-4 text-center hover:border-emerald-500/50 transition-all">
                <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
                {file ? <div className="flex items-center justify-center gap-2"><FileText className="h-4 w-4 text-emerald-400" /><span className="text-sm">{file.name}</span></div>
                : <><Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">Click to upload</p></>}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-4 space-y-3">
              <div><Label>Job Title</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" className="mt-1 bg-white/5 border-white/10" /></div>
              <div><Label>Job Description</Label><Textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste JD here..." rows={3} className="mt-1 bg-white/5 border-white/10" /></div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleOptimize} disabled={loading} size="lg" className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 mb-8">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Optimizing..." : "Optimize Resume"}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Comparison */}
            <Card className="border-white/10 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Current Score</div>
                    <div className="text-4xl font-bold text-amber-400">{Math.round(result.current_score)}%</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="h-6 w-6 text-emerald-400" />
                    <ArrowUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">+{Math.round(result.potential_score - result.current_score)}%</span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Potential Score</div>
                    <div className="text-4xl font-bold text-emerald-400">{Math.round(result.potential_score)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            {result.missing_skills.length > 0 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" />Add These Skills</CardTitle></CardHeader>
                <CardContent><div className="flex flex-wrap gap-2">{result.missing_skills.map((s, i) => <Badge key={i} className="bg-amber-500/10 text-amber-300 border-amber-500/20">+ {s}</Badge>)}</div></CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-400" />Improvement Suggestions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{s.category}</Badge>
                        <Badge className={`text-xs ${impactColor(s.impact)}`}>{s.impact} Impact</Badge>
                      </div>
                      {s.current && <p className="text-sm text-muted-foreground mb-1"><span className="text-red-400/70">Current:</span> {s.current}</p>}
                      <p className="text-sm"><span className="text-emerald-400">Suggested:</span> {s.suggested}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Rewrite Suggestions */}
            {result.rewrite_suggestions.length > 0 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-4 w-4 text-purple-400" />Rewrite Suggestions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {result.rewrite_suggestions.map((r, i) => (
                    <div key={i} className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
                      <Badge variant="secondary" className="text-xs mb-2">{r.section}</Badge>
                      {r.original && <div className="text-sm text-red-300/60 line-through mb-2">{r.original}</div>}
                      <div className="text-sm text-emerald-300 mb-2">{r.rewritten}</div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground italic">{r.reason}</p>
                        <Button size="sm" variant="ghost" onClick={() => copyText(r.rewritten)} className="h-7 text-xs gap-1"><Copy className="h-3 w-3" />Copy</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
