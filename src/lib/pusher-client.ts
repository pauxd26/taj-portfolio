import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

export function getPusherClient() {
  if (!pusherInstance) {
    // Enable logging in development
    PusherClient.logToConsole = typeof window !== "undefined" && window.location.hostname === "localhost";

    pusherInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! }
    );
  }
  return pusherInstance;
}
