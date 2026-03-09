import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { RESUME_DATA, SYSTEM_PROMPT } from "@/lib/knowledge";

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const getResend = () => new Resend(process.env.RESEND_API_KEY);

async function notifyByEmail(userMessage: string, allMessages: { role: string; content: string }[]) {
  try {
    const conversationHtml = allMessages
      .map(
        (m) =>
          `<div style="margin-bottom:8px;"><strong style="color:${m.role === "user" ? "#6366f1" : "#06b6d4"}">${m.role === "user" ? "Visitor" : "Assistant"}:</strong> ${m.content}</div>`
      )
      .join("");

    await getResend().emails.send({
      from: "Portfolio Bot <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "taj479505@gmail.com",
      subject: `Portfolio Chat: ${userMessage.substring(0, 60)}${userMessage.length > 60 ? "..." : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:24px;border-radius:12px;">
          <h2 style="color:#6366f1;margin-top:0;">New Portfolio Chat Message</h2>
          <p style="color:#94a3b8;font-size:14px;">Someone is chatting on your portfolio website.</p>
          <div style="background:#1e293b;padding:16px;border-radius:8px;margin:16px 0;font-size:14px;line-height:1.6;">
            ${conversationHtml}
          </div>
          <p style="color:#64748b;font-size:12px;margin-bottom:0;">Sent from taj-portfolio chatbot</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email notification failed:", err);
  }
}

// Tool definitions for Claude
const tools: Anthropic.Messages.Tool[] = [
  {
    name: "search_resume",
    description:
      "Search Taj's resume for information about his experience, skills, education, or background. Use this when the user asks about Taj's qualifications, work history, or technical abilities.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "The search query (e.g., 'experience with LangGraph', 'education', 'skills in Python')",
        },
        section: {
          type: "string",
          enum: ["skills", "experience", "education", "summary", "all"],
          description: "Which section of the resume to search",
        },
      },
      required: ["query", "section"],
    },
  },
  {
    name: "lookup_projects",
    description:
      "Look up Taj's projects including enterprise work and open source side projects. Use this when asked about specific projects, GitHub repos, or portfolio work.",
    input_schema: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["enterprise", "side_projects", "all"],
          description: "Type of projects to look up",
        },
        query: {
          type: "string",
          description: "Optional keyword to filter projects",
        },
      },
      required: ["type"],
    },
  },
  {
    name: "collect_contact",
    description:
      "Collect a visitor's contact information or message for Taj. Use this when someone wants to reach out, leave a message, discuss opportunities, or get in touch.",
    input_schema: {
      type: "object" as const,
      properties: {
        visitor_name: { type: "string", description: "The visitor's name" },
        visitor_email: { type: "string", description: "The visitor's email address" },
        message: { type: "string", description: "The message they want to send to Taj" },
        purpose: {
          type: "string",
          enum: ["job_opportunity", "collaboration", "question", "other"],
          description: "Purpose of the contact",
        },
      },
      required: ["message"],
    },
  },
  {
    name: "get_contact_info",
    description:
      "Get Taj's contact information (email, phone, LinkedIn, GitHub). Use when someone asks how to reach Taj directly.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "schedule_meeting",
    description:
      "Provide a link to schedule a meeting with Taj. Use when someone wants to book a call, schedule a meeting, set up a chat, or discuss opportunities.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

// Tool execution
function executeTool(name: string, input: Record<string, string>): string {
  switch (name) {
    case "search_resume": {
      const section = input.section || "all";
      const query = (input.query || "").toLowerCase();
      const results: string[] = [];

      if (section === "summary" || section === "all") {
        if (query.split(" ").some((w: string) => RESUME_DATA.summary.toLowerCase().includes(w))) {
          results.push(`**Summary:** ${RESUME_DATA.summary}`);
        }
      }

      if (section === "skills" || section === "all") {
        const allSkills = Object.entries(RESUME_DATA.skills);
        for (const [category, skills] of allSkills) {
          const matched = skills.filter((s: string) => s.toLowerCase().includes(query));
          if (matched.length > 0 || query.split(" ").some((w: string) => category.includes(w))) {
            results.push(`**${category}:** ${skills.join(", ")}`);
          }
        }
        if (results.length === 0 && section === "skills") {
          results.push(
            ...allSkills.map(([cat, skills]) => `**${cat}:** ${skills.join(", ")}`)
          );
        }
      }

      if (section === "experience" || section === "all") {
        for (const job of RESUME_DATA.experience) {
          const matchedHighlights = job.highlights.filter((h: string) =>
            query.split(" ").some((w: string) => h.toLowerCase().includes(w))
          );
          if (matchedHighlights.length > 0 || query.split(" ").some((w: string) => job.company.toLowerCase().includes(w) || job.role.toLowerCase().includes(w))) {
            results.push(
              `**${job.role} at ${job.company}** (${job.period})\n${(matchedHighlights.length > 0 ? matchedHighlights : job.highlights.slice(0, 5)).map((h: string) => `- ${h}`).join("\n")}`
            );
          }
        }
      }

      if (section === "education" || section === "all") {
        if (query.includes("educat") || query.includes("degree") || query.includes("university") || section === "education") {
          results.push(
            ...RESUME_DATA.education.map(
              (e) => `**${e.degree}** — ${e.school} (${e.period})`
            )
          );
        }
      }

      return results.length > 0
        ? results.join("\n\n")
        : `No specific results for "${input.query}". Taj has 8+ years in backend systems and 2+ years in Agentic AI, working at HPE and Adobe.`;
    }

    case "lookup_projects": {
      const type = input.type || "all";
      const query = (input.query || "").toLowerCase();
      const results: string[] = [];

      if (type === "enterprise" || type === "all") {
        for (const job of RESUME_DATA.experience) {
          const text = `**${job.company}** (${job.period}): ${job.highlights.slice(0, 3).join(" ")}`;
          if (!query || query.split(" ").some((w: string) => text.toLowerCase().includes(w))) {
            results.push(text);
          }
        }
      }

      if (type === "side_projects" || type === "all") {
        for (const proj of RESUME_DATA.side_projects) {
          if (!query || query.split(" ").some((w: string) => proj.name.toLowerCase().includes(w) || proj.description.toLowerCase().includes(w))) {
            results.push(
              `**${proj.name}**: ${proj.description}\nTech: ${proj.tech.join(", ")}\nGitHub: ${proj.github}`
            );
          }
        }
      }

      return results.length > 0 ? results.join("\n\n") : "No matching projects found.";
    }

    case "collect_contact": {
      // In production, this would save to a database or send an email
      return `Contact message recorded successfully! Details:\n- Name: ${input.visitor_name || "Not provided"}\n- Email: ${input.visitor_email || "Not provided"}\n- Purpose: ${input.purpose || "general"}\n- Message: "${input.message}"\n\nTaj will receive this and get back to them soon.`;
    }

    case "get_contact_info": {
      return `**Taj Khunkhun's Contact Info:**\n- Email: ${RESUME_DATA.email}\n- Phone: ${RESUME_DATA.phone}\n- LinkedIn: ${RESUME_DATA.linkedin}\n- GitHub: ${RESUME_DATA.github}\n- Location: ${RESUME_DATA.location}`;
    }

    case "schedule_meeting": {
      return `**Schedule a Meeting with Taj:**\nBook a 30-minute call here: [Schedule on Calendly](https://calendly.com/taj479505/30min)\n\nTaj is available for discussions about AI engineering, agentic systems, and potential collaborations.`;
    }

    default:
      return "Unknown tool.";
  }
}

// Agent step types
interface AgentStep {
  agent: string;
  status: "running" | "complete";
  detail: string;
  tool_name?: string;
  tool_input?: Record<string, string>;
  tool_result?: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Build the streaming response with agent steps
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Step 1: Classifier Agent
        send({ type: "step", step: { agent: "Classifier", status: "running", detail: "Analyzing query intent..." } });
        await sleep(300);

        const userMessage = messages[messages.length - 1]?.content || "";
        const intent = classifyIntent(userMessage);
        send({ type: "step", step: { agent: "Classifier", status: "complete", detail: `Intent: ${intent}` } });

        // Step 2: Router Agent
        send({ type: "step", step: { agent: "Router", status: "running", detail: "Selecting optimal agent path..." } });
        await sleep(200);

        const route = routeIntent(intent);
        send({ type: "step", step: { agent: "Router", status: "complete", detail: `Route: ${route}` } });

        // Step 3: Tool Executor (Claude with tool use)
        send({ type: "step", step: { agent: "Executor", status: "running", detail: "Invoking Claude with tools..." } });

        const claudeMessages = messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        let response = await getAnthropic().messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          tools,
          messages: claudeMessages,
        });

        // Handle tool use loop
        let iterations = 0;
        const maxIterations = 3;

        while (response.stop_reason === "tool_use" && iterations < maxIterations) {
          iterations++;
          const toolUseBlocks = response.content.filter(
            (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use"
          );

          const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

          for (const toolUse of toolUseBlocks) {
            send({
              type: "step",
              step: {
                agent: "Executor",
                status: "running",
                detail: `Calling tool: ${toolUse.name}`,
                tool_name: toolUse.name,
                tool_input: toolUse.input as Record<string, string>,
              },
            });

            const result = executeTool(toolUse.name, toolUse.input as Record<string, string>);

            send({
              type: "step",
              step: {
                agent: "Executor",
                status: "complete",
                detail: `Tool ${toolUse.name} returned results`,
                tool_name: toolUse.name,
                tool_result: result.substring(0, 200) + (result.length > 200 ? "..." : ""),
              },
            });

            toolResults.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: result,
            });
          }

          response = await getAnthropic().messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            tools,
            messages: [
              ...claudeMessages,
              { role: "assistant", content: response.content },
              { role: "user", content: toolResults },
            ],
          });
        }

        send({ type: "step", step: { agent: "Executor", status: "complete", detail: "Processing complete" } });

        // Step 4: Responder Agent
        send({ type: "step", step: { agent: "Responder", status: "running", detail: "Formatting response..." } });
        await sleep(200);

        const textBlock = response.content.find(
          (b): b is Anthropic.Messages.TextBlock => b.type === "text"
        );
        const finalText = textBlock?.text || "I apologize, I couldn't generate a response. Please try again.";

        send({ type: "step", step: { agent: "Responder", status: "complete", detail: "Response ready" } });
        send({ type: "message", content: finalText });
        send({ type: "done" });

        // Send email notification (non-blocking)
        const fullConversation = [
          ...claudeMessages,
          { role: "assistant", content: finalText },
        ];
        notifyByEmail(userMessage, fullConversation).catch(() => {});

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

function classifyIntent(message: string): string {
  const lower = message.toLowerCase();
  if (lower.match(/contact|reach|email|phone|hire|job|opportunit|connect/)) return "contact_inquiry";
  if (lower.match(/project|github|repo|built|portfolio|side/)) return "project_inquiry";
  if (lower.match(/skill|tech|stack|language|framework|tool|know/)) return "skills_inquiry";
  if (lower.match(/experience|work|company|hpe|adobe|role|position/)) return "experience_inquiry";
  if (lower.match(/education|university|degree|school|study/)) return "education_inquiry";
  if (lower.match(/who|about|background|summary|intro/)) return "about_inquiry";
  return "general_inquiry";
}

function routeIntent(intent: string): string {
  const routes: Record<string, string> = {
    contact_inquiry: "Contact Handler → collect_contact tool",
    project_inquiry: "Project Lookup → lookup_projects tool",
    skills_inquiry: "Resume Search → search_resume(skills)",
    experience_inquiry: "Resume Search → search_resume(experience)",
    education_inquiry: "Resume Search → search_resume(education)",
    about_inquiry: "Resume Search → search_resume(summary)",
    general_inquiry: "General Responder → Claude direct",
  };
  return routes[intent] || "General Responder";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
