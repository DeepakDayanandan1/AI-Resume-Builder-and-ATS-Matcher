"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User, GraduationCap, Briefcase, Code, Award, FolderOpen,
  Plus, Trash2, Download, Eye, Save, ChevronRight, Loader2,
} from "lucide-react";
import type { ResumeData, Education, Experience, Project, SkillCategory, Certification } from "@/types";
import { defaultResume } from "@/types";
import { createResume, generatePDFPreview } from "@/lib/api";

const templates = [
  { id: "professional", name: "Professional", color: "from-blue-600 to-blue-800", desc: "Clean corporate style" },
  { id: "modern", name: "Modern", color: "from-purple-600 to-purple-800", desc: "Sidebar layout with accents" },
  { id: "minimal", name: "Minimal", color: "from-emerald-600 to-emerald-800", desc: "Simple & elegant" },
];

export default function BuilderPage() {
  const [resume, setResume] = useState<ResumeData>({ ...defaultResume });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const updatePersonal = (field: string, value: string) => {
    setResume((r) => ({ ...r, personal_info: { ...r.personal_info, [field]: value } }));
  };

  // Education helpers
  const addEducation = () => {
    setResume((r) => ({
      ...r,
      education: [...r.education, { institution: "", degree: "", field: "", start_date: "", end_date: "", gpa: "", description: "" }],
    }));
  };
  const updateEducation = (i: number, field: keyof Education, value: string) => {
    const updated = [...resume.education];
    updated[i] = { ...updated[i], [field]: value };
    setResume((r) => ({ ...r, education: updated }));
  };
  const removeEducation = (i: number) => {
    setResume((r) => ({ ...r, education: r.education.filter((_, idx) => idx !== i) }));
  };

  // Experience helpers
  const addExperience = () => {
    setResume((r) => ({
      ...r,
      experience: [...r.experience, { company: "", position: "", start_date: "", end_date: "", description: "", highlights: [""] }],
    }));
  };
  const updateExperience = (i: number, field: keyof Experience, value: string | string[]) => {
    const updated = [...resume.experience];
    updated[i] = { ...updated[i], [field]: value };
    setResume((r) => ({ ...r, experience: updated }));
  };
  const removeExperience = (i: number) => {
    setResume((r) => ({ ...r, experience: r.experience.filter((_, idx) => idx !== i) }));
  };

  // Skills helpers
  const addSkillCategory = () => {
    setResume((r) => ({ ...r, skills: [...r.skills, { category: "", items: [""] }] }));
  };
  const updateSkillCategory = (i: number, field: keyof SkillCategory, value: string | string[]) => {
    const updated = [...resume.skills];
    updated[i] = { ...updated[i], [field]: value };
    setResume((r) => ({ ...r, skills: updated }));
  };
  const removeSkillCategory = (i: number) => {
    setResume((r) => ({ ...r, skills: r.skills.filter((_, idx) => idx !== i) }));
  };

  // Projects helpers
  const addProject = () => {
    setResume((r) => ({
      ...r,
      projects: [...r.projects, { name: "", description: "", tech_stack: [""], url: "", highlights: [""] }],
    }));
  };
  const updateProject = (i: number, field: keyof Project, value: string | string[]) => {
    const updated = [...resume.projects];
    updated[i] = { ...updated[i], [field]: value };
    setResume((r) => ({ ...r, projects: updated }));
  };
  const removeProject = (i: number) => {
    setResume((r) => ({ ...r, projects: r.projects.filter((_, idx) => idx !== i) }));
  };

  // Certifications helpers
  const addCertification = () => {
    setResume((r) => ({
      ...r,
      certifications: [...r.certifications, { name: "", issuer: "", date: "", url: "" }],
    }));
  };
  const updateCertification = (i: number, field: keyof Certification, value: string) => {
    const updated = [...resume.certifications];
    updated[i] = { ...updated[i], [field]: value };
    setResume((r) => ({ ...r, certifications: updated }));
  };
  const removeCertification = (i: number) => {
    setResume((r) => ({ ...r, certifications: r.certifications.filter((_, idx) => idx !== i) }));
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const blob = await generatePDFPreview(resume);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.personal_info.name || "resume"}_resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate PDF";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createResume(resume);
      toast.success("Resume saved successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save resume";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    { value: "personal", label: "Personal", icon: User },
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "experience", label: "Experience", icon: Briefcase },
    { value: "skills", label: "Skills", icon: Code },
    { value: "projects", label: "Projects", icon: FolderOpen },
    { value: "certifications", label: "Certs", icon: Award },
    { value: "template", label: "Template", icon: Eye },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Resume <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Builder</span>
          </h1>
          <p className="text-muted-foreground mt-1">Fill in your details, pick a template, and download your resume as PDF.</p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <Label>Resume Title</Label>
          <Input value={resume.title} onChange={(e) => setResume((r) => ({ ...r, title: e.target.value }))} placeholder="e.g. Software Engineer Resume" className="mt-1 bg-white/5 border-white/10" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-white/5 p-1 mb-6">
            {tabItems.map((t) => {
              const Icon = t.icon;
              return (
                <TabsTrigger key={t.value} value={t.value} className="gap-1.5 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <Card className="border-white/10 bg-white/5">
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-cyan-500" />Personal Information</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input value={resume.personal_info.name} onChange={(e) => updatePersonal("name", e.target.value)} placeholder="John Doe" className="mt-1 bg-white/5 border-white/10" /></div>
                <div><Label>Email</Label><Input value={resume.personal_info.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="john@example.com" className="mt-1 bg-white/5 border-white/10" /></div>
                <div><Label>Phone</Label><Input value={resume.personal_info.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+1 234 567 890" className="mt-1 bg-white/5 border-white/10" /></div>
                <div><Label>LinkedIn</Label><Input value={resume.personal_info.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" className="mt-1 bg-white/5 border-white/10" /></div>
                <div><Label>GitHub</Label><Input value={resume.personal_info.github} onChange={(e) => updatePersonal("github", e.target.value)} placeholder="github.com/johndoe" className="mt-1 bg-white/5 border-white/10" /></div>
                <div><Label>Website</Label><Input value={resume.personal_info.website} onChange={(e) => updatePersonal("website", e.target.value)} placeholder="johndoe.com" className="mt-1 bg-white/5 border-white/10" /></div>
                <div className="sm:col-span-2"><Label>Professional Summary</Label><Textarea value={resume.personal_info.summary} onChange={(e) => updatePersonal("summary", e.target.value)} placeholder="A brief summary of your professional background..." rows={4} className="mt-1 bg-white/5 border-white/10" /></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-cyan-500" />Education</CardTitle>
                <Button size="sm" onClick={addEducation} className="gap-1 bg-cyan-600 hover:bg-cyan-500"><Plus className="h-4 w-4" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.education.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No education added yet. Click &quot;Add&quot; to get started.</p>}
                {resume.education.map((edu, i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3 bg-white/[0.02]">
                    <div className="flex justify-between items-center"><Badge variant="secondary">#{i + 1}</Badge><Button size="icon" variant="ghost" onClick={() => removeEducation(i)} className="h-7 w-7 text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></Button></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><Label>Institution</Label><Input value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="MIT" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} placeholder="B.Tech" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Field of Study</Label><Input value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} placeholder="Computer Science" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>GPA</Label><Input value={edu.gpa} onChange={(e) => updateEducation(i, "gpa", e.target.value)} placeholder="3.8/4.0" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Start Date</Label><Input value={edu.start_date} onChange={(e) => updateEducation(i, "start_date", e.target.value)} placeholder="Aug 2020" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>End Date</Label><Input value={edu.end_date} onChange={(e) => updateEducation(i, "end_date", e.target.value)} placeholder="May 2024" className="mt-1 bg-white/5 border-white/10" /></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-cyan-500" />Experience</CardTitle>
                <Button size="sm" onClick={addExperience} className="gap-1 bg-cyan-600 hover:bg-cyan-500"><Plus className="h-4 w-4" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.experience.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No experience added yet.</p>}
                {resume.experience.map((exp, i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3 bg-white/[0.02]">
                    <div className="flex justify-between items-center"><Badge variant="secondary">#{i + 1}</Badge><Button size="icon" variant="ghost" onClick={() => removeExperience(i)} className="h-7 w-7 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><Label>Company</Label><Input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Google" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Position</Label><Input value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} placeholder="Software Engineer" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Start Date</Label><Input value={exp.start_date} onChange={(e) => updateExperience(i, "start_date", e.target.value)} placeholder="Jan 2023" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>End Date</Label><Input value={exp.end_date} onChange={(e) => updateExperience(i, "end_date", e.target.value)} placeholder="Present" className="mt-1 bg-white/5 border-white/10" /></div>
                    </div>
                    <div><Label>Description</Label><Textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Brief role description..." rows={2} className="mt-1 bg-white/5 border-white/10" /></div>
                    <div>
                      <Label>Highlights / Achievements</Label>
                      {exp.highlights.map((h, hi) => (
                        <div key={hi} className="flex gap-2 mt-1">
                          <Input value={h} onChange={(e) => { const hl = [...exp.highlights]; hl[hi] = e.target.value; updateExperience(i, "highlights", hl); }} placeholder="Achieved X by doing Y..." className="bg-white/5 border-white/10" />
                          <Button size="icon" variant="ghost" onClick={() => { const hl = exp.highlights.filter((_, idx) => idx !== hi); updateExperience(i, "highlights", hl); }} className="shrink-0 text-red-400 h-9 w-9"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <Button size="sm" variant="ghost" onClick={() => updateExperience(i, "highlights", [...exp.highlights, ""])} className="mt-2 text-xs text-cyan-400"><Plus className="h-3 w-3 mr-1" />Add Highlight</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-cyan-500" />Skills</CardTitle>
                <Button size="sm" onClick={addSkillCategory} className="gap-1 bg-cyan-600 hover:bg-cyan-500"><Plus className="h-4 w-4" />Add Category</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.skills.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No skills added yet.</p>}
                {resume.skills.map((skill, i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3 bg-white/[0.02]">
                    <div className="flex justify-between items-center">
                      <Input value={skill.category} onChange={(e) => updateSkillCategory(i, "category", e.target.value)} placeholder="e.g. Programming Languages" className="bg-white/5 border-white/10 font-medium max-w-xs" />
                      <Button size="icon" variant="ghost" onClick={() => removeSkillCategory(i)} className="h-7 w-7 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                    <div><Label className="text-xs text-muted-foreground">Skills (comma-separated)</Label><Input value={skill.items.join(", ")} onChange={(e) => updateSkillCategory(i, "items", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Python, JavaScript, TypeScript" className="mt-1 bg-white/5 border-white/10" /></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5 text-cyan-500" />Projects</CardTitle>
                <Button size="sm" onClick={addProject} className="gap-1 bg-cyan-600 hover:bg-cyan-500"><Plus className="h-4 w-4" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.projects.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No projects added yet.</p>}
                {resume.projects.map((proj, i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3 bg-white/[0.02]">
                    <div className="flex justify-between items-center"><Badge variant="secondary">#{i + 1}</Badge><Button size="icon" variant="ghost" onClick={() => removeProject(i)} className="h-7 w-7 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><Label>Project Name</Label><Input value={proj.name} onChange={(e) => updateProject(i, "name", e.target.value)} placeholder="My Project" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>URL</Label><Input value={proj.url} onChange={(e) => updateProject(i, "url", e.target.value)} placeholder="github.com/..." className="mt-1 bg-white/5 border-white/10" /></div>
                    </div>
                    <div><Label>Description</Label><Textarea value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} rows={2} placeholder="Brief project description..." className="mt-1 bg-white/5 border-white/10" /></div>
                    <div><Label className="text-xs text-muted-foreground">Tech Stack (comma-separated)</Label><Input value={proj.tech_stack.join(", ")} onChange={(e) => updateProject(i, "tech_stack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="React, Node.js, PostgreSQL" className="mt-1 bg-white/5 border-white/10" /></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications */}
          <TabsContent value="certifications">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-cyan-500" />Certifications</CardTitle>
                <Button size="sm" onClick={addCertification} className="gap-1 bg-cyan-600 hover:bg-cyan-500"><Plus className="h-4 w-4" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.certifications.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No certifications added yet.</p>}
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
                    <div className="flex justify-between items-center mb-3"><Badge variant="secondary">#{i + 1}</Badge><Button size="icon" variant="ghost" onClick={() => removeCertification(i)} className="h-7 w-7 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><Label>Name</Label><Input value={cert.name} onChange={(e) => updateCertification(i, "name", e.target.value)} placeholder="AWS Certified" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Issuer</Label><Input value={cert.issuer} onChange={(e) => updateCertification(i, "issuer", e.target.value)} placeholder="Amazon" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>Date</Label><Input value={cert.date} onChange={(e) => updateCertification(i, "date", e.target.value)} placeholder="Jan 2024" className="mt-1 bg-white/5 border-white/10" /></div>
                      <div><Label>URL</Label><Input value={cert.url} onChange={(e) => updateCertification(i, "url", e.target.value)} placeholder="credential URL" className="mt-1 bg-white/5 border-white/10" /></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Template Selection */}
          <TabsContent value="template">
            <Card className="border-white/10 bg-white/5">
              <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-cyan-500" />Select Template</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {templates.map((t) => (
                    <button key={t.id} onClick={() => setResume((r) => ({ ...r, template_id: t.id }))} className={`rounded-xl border p-4 text-left transition-all ${resume.template_id === t.id ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
                      <div className={`h-24 rounded-lg bg-gradient-to-br ${t.color} mb-3`} />
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={handleSave} disabled={loading} className="gap-2 border-white/20">
            <Save className="h-4 w-4" /> Save Resume
          </Button>
          <Button onClick={handleDownloadPDF} disabled={loading} className="gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
