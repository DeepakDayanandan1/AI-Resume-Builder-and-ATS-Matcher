import type {
  ResumeData,
  ATSAnalysis,
  JobMatchResult,
  OptimizeResult,
  ResumeTemplate,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// ── Resume API ────────────────────────────────────────────────

export async function getTemplates(): Promise<ResumeTemplate[]> {
  const res = await fetch(`${API_URL}/api/resumes/templates`);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function createResume(data: ResumeData): Promise<ResumeData> {
  const res = await fetch(`${API_URL}/api/resumes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ResumeData>(res);
}

export async function getResumes(): Promise<ResumeData[]> {
  const res = await fetch(`${API_URL}/api/resumes`);
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function getResume(id: string): Promise<ResumeData> {
  const res = await fetch(`${API_URL}/api/resumes/${id}`);
  if (!res.ok) throw new Error("Resume not found");
  return res.json();
}

export async function updateResume(
  id: string,
  data: ResumeData
): Promise<ResumeData> {
  const res = await fetch(`${API_URL}/api/resumes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update resume");
  return res.json();
}

export async function deleteResume(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/resumes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete resume");
}

export async function renderResumeHTML(data: ResumeData): Promise<string> {
  const res = await fetch(`${API_URL}/api/resumes/render-html`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("HTML rendering failed");
  return res.text();
}

export async function generatePDFPreview(data: ResumeData): Promise<Blob> {
  const html = await renderResumeHTML(data);

  // Use jsPDF + html2canvas but render inside a completely isolated iframe
  // to avoid the app's oklch/lab CSS colors that html2canvas cannot parse
  const html2pdf = (await import("html2pdf.js")).default;

  return new Promise<Blob>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "794px"; // A4 width at 96dpi
    iframe.style.height = "1123px"; // A4 height at 96dpi
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow) throw new Error("Failed to access iframe");

        // Wait for fonts to load inside the iframe
        await new Promise((r) => setTimeout(r, 800));

        // Import html2pdf inside the iframe context to avoid parent CSS
        const script = iframeWindow.document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";
        
        await new Promise<void>((resolveScript, rejectScript) => {
          script.onload = () => resolveScript();
          script.onerror = () => rejectScript(new Error("Failed to load html2pdf"));
          iframeWindow.document.head.appendChild(script);
        });

        // Use html2pdf from inside the iframe (no parent oklch/lab styles)
        const iframeHtml2pdf = (iframeWindow as unknown as Record<string, unknown>).html2pdf as typeof html2pdf;
        
        const blob: Blob = await iframeHtml2pdf()
          .set({
            margin: 0,
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(iframeWindow.document.body)
          .outputPdf("blob");

        resolve(blob);
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(iframe);
      }
    };

    // Write complete HTML into iframe using srcdoc to ensure full isolation
    iframe.srcdoc = html;
  });
}

// ── Analyzer API ──────────────────────────────────────────────

export async function analyzeResume(file: File): Promise<ATSAnalysis> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/analyze/resume`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Analysis failed");
  }
  return res.json();
}

export async function analyzeResumeText(
  resumeText: string
): Promise<ATSAnalysis> {
  const res = await fetch(`${API_URL}/api/analyze/resume-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText }),
  });
  return handleResponse<ATSAnalysis>(res);
}

// ── Matcher API ───────────────────────────────────────────────

export async function matchResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): Promise<JobMatchResult> {
  const res = await fetch(`${API_URL}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume_text: resumeText,
      job_title: jobTitle,
      job_description: jobDescription,
    }),
  });
  return handleResponse<JobMatchResult>(res);
}

export async function matchResumeFile(
  file: File,
  jobTitle: string,
  jobDescription: string
): Promise<JobMatchResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_title", jobTitle);
  formData.append("job_description", jobDescription);
  const res = await fetch(`${API_URL}/api/match/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<JobMatchResult>(res);
}

// ── Optimizer API ─────────────────────────────────────────────

export async function optimizeResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): Promise<OptimizeResult> {
  const res = await fetch(`${API_URL}/api/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume_text: resumeText,
      job_title: jobTitle,
      job_description: jobDescription,
    }),
  });
  return handleResponse<OptimizeResult>(res);
}

export async function optimizeResumeFile(
  file: File,
  jobTitle: string,
  jobDescription: string
): Promise<OptimizeResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_title", jobTitle);
  formData.append("job_description", jobDescription);
  const res = await fetch(`${API_URL}/api/optimize/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<OptimizeResult>(res);
}
