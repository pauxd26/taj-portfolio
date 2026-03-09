import { RESUME_DATA } from "@/lib/knowledge";

export async function GET() {
  const r = RESUME_DATA;

  const skillLines = Object.entries(r.skills)
    .map(([cat, skills]) => {
      const label = cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `${label}: ${skills.join(", ")}`;
    })
    .join("\n");

  const expLines = r.experience
    .map((job) => {
      const highlights = job.highlights.map((h) => `  - ${h}`).join("\n");
      return `${job.role}\n${job.company} | ${job.location} | ${job.period}\n${highlights}`;
    })
    .join("\n\n");

  const eduLines = r.education
    .map((e) => `${e.degree} - ${e.school} (${e.period})`)
    .join("\n");

  const projLines = r.side_projects
    .map((p) => `${p.name}: ${p.description}\n  Tech: ${p.tech.join(", ")} | ${p.github}`)
    .join("\n\n");

  // Build PDF using raw PDF syntax (no dependencies needed)
  const content = buildPdf(r.name, r.email, r.phone, r.location, r.linkedin, r.github, r.summary, skillLines, expLines, eduLines, projLines);

  return new Response(content as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Taj_Khunkhun_Resume.pdf",
    },
  });
}

function buildPdf(
  name: string, email: string, phone: string, location: string,
  linkedin: string, github: string, summary: string,
  skills: string, experience: string, education: string, projects: string
): Uint8Array {
  // Simple PDF generator - no external dependencies
  const lines: string[] = [];
  const objects: { offset: number }[] = [];
  let pos = 0;

  const write = (s: string) => { lines.push(s); pos += s.length + 1; };
  const startObj = (n: number) => { objects[n] = { offset: pos }; write(`${n} 0 obj`); };

  // PDF Header
  write("%PDF-1.4");

  // Catalog
  startObj(1);
  write("<< /Type /Catalog /Pages 2 0 R >>");
  write("endobj");

  // Pages
  startObj(2);
  write("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  write("endobj");

  // Font
  startObj(4);
  write("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  write("endobj");

  startObj(5);
  write("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  write("endobj");

  // Build content stream
  const stream = buildContentStream(
    name, email, phone, location, linkedin, github,
    summary, skills, experience, education, projects
  );

  startObj(6);
  write(`<< /Length ${stream.length} >>`);
  write("stream");
  write(stream);
  write("endstream");
  write("endobj");

  // Page
  startObj(3);
  write("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> >>");
  write("endobj");

  // XRef
  const xrefOffset = pos;
  write("xref");
  write(`0 ${objects.length + 1}`);
  write("0000000000 65535 f ");
  for (let i = 1; i <= objects.length; i++) {
    const off = objects[i]?.offset || 0;
    write(`${String(off).padStart(10, "0")} 00000 n `);
  }
  write("trailer");
  write(`<< /Size ${objects.length + 1} /Root 1 0 R >>`);
  write("startxref");
  write(String(xrefOffset));
  write("%%EOF");

  return new TextEncoder().encode(lines.join("\n"));
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildContentStream(
  name: string, email: string, phone: string, location: string,
  linkedin: string, github: string, summary: string,
  skills: string, experience: string, education: string, projects: string
): string {
  const cmds: string[] = [];
  let y = 760;
  const leftMargin = 50;
  const rightLimit = 550;

  const textLine = (font: string, size: number, text: string, x = leftMargin) => {
    if (y < 40) return; // Stop if we hit bottom
    cmds.push(`BT /${font} ${size} Tf ${x} ${y} Td (${esc(text)}) Tj ET`);
    y -= size + 4;
  };

  const spacer = (h = 8) => { y -= h; };

  const wrapText = (font: string, size: number, text: string, maxWidth = rightLimit - leftMargin) => {
    const charWidth = size * 0.5; // Approximate
    const maxChars = Math.floor(maxWidth / charWidth);
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      if ((line + " " + word).trim().length > maxChars && line) {
        textLine(font, size, line.trim());
        line = word;
      } else {
        line = line ? line + " " + word : word;
      }
    }
    if (line) textLine(font, size, line.trim());
  };

  // Header
  textLine("F2", 20, name);
  textLine("F1", 9, `${email} | ${phone} | ${location}`);
  textLine("F1", 9, `LinkedIn: ${linkedin}`);
  textLine("F1", 9, `GitHub: ${github}`);

  // Line
  spacer(4);
  cmds.push(`${leftMargin} ${y} m ${rightLimit + leftMargin} ${y} l S`);
  spacer(10);

  // Summary
  textLine("F2", 12, "PROFESSIONAL SUMMARY");
  spacer(2);
  wrapText("F1", 8.5, summary);

  spacer(6);
  textLine("F2", 12, "TECHNICAL SKILLS");
  spacer(2);
  for (const line of skills.split("\n")) {
    const [label, ...rest] = line.split(": ");
    if (label && rest.length) {
      textLine("F2", 8.5, label + ":");
      wrapText("F1", 8, rest.join(": "));
      spacer(2);
    }
  }

  spacer(6);
  textLine("F2", 12, "PROFESSIONAL EXPERIENCE");
  spacer(2);
  for (const line of experience.split("\n")) {
    if (y < 40) break;
    const trimmed = line.trim();
    if (!trimmed) { spacer(4); continue; }
    if (trimmed.startsWith("- ")) {
      wrapText("F1", 8, "  " + trimmed);
    } else if (trimmed.includes("|")) {
      textLine("F1", 8.5, trimmed);
    } else {
      textLine("F2", 10, trimmed);
    }
  }

  spacer(6);
  textLine("F2", 12, "EDUCATION");
  spacer(2);
  for (const line of education.split("\n")) {
    textLine("F1", 9, line);
  }

  spacer(6);
  textLine("F2", 12, "SIDE PROJECTS");
  spacer(2);
  for (const line of projects.split("\n")) {
    if (y < 40) break;
    const trimmed = line.trim();
    if (!trimmed) { spacer(3); continue; }
    if (trimmed.startsWith("Tech:")) {
      textLine("F1", 7.5, "  " + trimmed);
    } else if (trimmed.includes(": ")) {
      const [projName, ...desc] = trimmed.split(": ");
      textLine("F2", 9, projName);
      wrapText("F1", 8, desc.join(": "));
    } else {
      wrapText("F1", 8, trimmed);
    }
  }

  return cmds.join("\n");
}
