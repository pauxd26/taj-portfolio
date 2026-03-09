import { pusherServer } from "@/lib/pusher-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory session store (resets on cold start — fine for portfolio use)
const sessions = new Map<
  string,
  { messages: { role: string; content: string; timestamp: number }[]; visitorName?: string }
>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "start": {
        const sessionId = `live-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const visitorName = body.visitorName || "Anonymous";
        sessions.set(sessionId, { messages: [], visitorName });

        const siteUrl = "https://taj-portfolio-eosin.vercel.app";

        // Fire-and-forget: Pusher + Email (don't block response)
        pusherServer.trigger("admin-notifications", "new-session", {
          sessionId,
          visitorName,
          timestamp: Date.now(),
        }).catch((err) => console.error("Pusher trigger failed:", err));

        resend.emails.send({
          from: "Portfolio Bot <onboarding@resend.dev>",
          to: process.env.NOTIFICATION_EMAIL || "taj479505@gmail.com",
          subject: `Live Chat Request from ${visitorName}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:24px;border-radius:12px;">
              <h2 style="color:#6366f1;margin-top:0;">Someone wants to chat live!</h2>
              <p style="color:#94a3b8;font-size:14px;"><strong>${visitorName}</strong> is waiting on your portfolio.</p>
              <a href="${siteUrl}/admin/chat?session=${sessionId}&secret=${process.env.ADMIN_SECRET}"
                 style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
                Join Chat Now
              </a>
              <p style="color:#64748b;font-size:12px;margin-bottom:0;">Session: ${sessionId}</p>
            </div>
          `,
        }).catch((err) => console.error("Email failed:", err));

        return Response.json({ sessionId });
      }

      case "message": {
        const { sessionId, role, content } = body;
        const session = sessions.get(sessionId);
        const msg = { role, content, timestamp: Date.now() };

        if (session) {
          session.messages.push(msg);
        } else {
          sessions.set(sessionId, { messages: [msg] });
        }

        // Broadcast to the session channel — await to ensure delivery
        try {
          await pusherServer.trigger(`chat-${sessionId}`, "new-message", msg);
        } catch (err) {
          console.error("Pusher message failed:", err);
          return Response.json({ ok: true, pusher_error: true });
        }

        return Response.json({ ok: true });
      }

      case "get-sessions": {
        if (body.secret !== process.env.ADMIN_SECRET) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allSessions = Array.from(sessions.entries()).map(([id, data]) => ({
          id,
          visitorName: data.visitorName || "Anonymous",
          messageCount: data.messages.length,
          lastMessage: data.messages[data.messages.length - 1],
        }));

        return Response.json({ sessions: allSessions });
      }

      case "get-messages": {
        const session = sessions.get(body.sessionId);
        return Response.json({ messages: session?.messages || [] });
      }

      case "join": {
        const { sessionId: joinId } = body;
        try {
          await pusherServer.trigger(`chat-${joinId}`, "admin-joined", {
            timestamp: Date.now(),
          });
        } catch (err) {
          console.error("Pusher join failed:", err);
        }
        return Response.json({ ok: true });
      }

      case "typing": {
        const { sessionId, role: typingRole } = body;
        try {
          await pusherServer.trigger(`chat-${sessionId}`, "typing", { role: typingRole });
        } catch (err) {
          console.error("Pusher typing failed:", err);
        }
        return Response.json({ ok: true });
      }

      case "end": {
        const { sessionId: endId } = body;
        try {
          await pusherServer.trigger(`chat-${endId}`, "session-ended", {
            message: "Chat session ended",
          });
        } catch (err) {
          console.error("Pusher end failed:", err);
        }
        sessions.delete(endId);
        return Response.json({ ok: true });
      }

      default:
        return Response.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Live chat error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
