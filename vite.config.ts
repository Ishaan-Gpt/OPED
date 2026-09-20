import { defineConfig } from "vite";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { config as loadDotenv } from "dotenv";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Vite only loads .env files into import.meta.env for client code, never into process.env.
// The dev API middleware below runs in plain Node and reads process.env directly, so load it here.
loadDotenv({ path: [".env", ".env.local"] });

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

/**
 * Dev-only local stand-ins for the AI teacher's server logic. In production these are
 * replaced by deployed Lambda Function URLs (see REMOTION_AWS_DEPLOY.md) — the client code
 * in src/lib/teacher/client.ts and src/lib/remotion/client.ts calls "/api/..." in dev and
 * should be pointed at the real Lambda URLs once deployed.
 */
function devTeacherApiPlugin(): Plugin {
  return {
    name: "dev-teacher-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "POST" || !req.url) return next();

        try {
          if (req.url === "/api/teacher/decide") {
            const { decideTeacherMove } = await import("./src/lib/teacher/decide");
            const context = await readJsonBody(req);
            const decision = await decideTeacherMove(context as never);
            return sendJson(res, 200, decision);
          }
          if (req.url === "/api/video/generate") {
            const { generateLessonVideo } = await import("./src/lib/remotion/render");
            const brief = await readJsonBody(req);
            const clip = await generateLessonVideo(brief as never);
            return sendJson(res, 200, clip);
          }
          if (req.url === "/api/lesson/generate") {
            const { generateLessonModule } = await import("./src/lib/teacher/generateModule");
            const request = await readJsonBody(req);
            const module = await generateLessonModule(request as never);
            if (!module) return sendJson(res, 502, { message: "Lesson generation failed" });
            return sendJson(res, 200, module);
          }
        } catch (error) {
          console.error(error);
          return sendJson(res, 500, {
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
        return next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    devTeacherApiPlugin(),
  ],
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000,
    host: true,
  },
  // These are Node-only, dynamically imported server-side (see src/lib/remotion/render.ts)
  // and must never be pulled into client/dep-optimizer scanning.
  optimizeDeps: {
    exclude: ["@remotion/bundler", "@remotion/renderer", "@remotion/lambda", "@rspack/core"],
  },
  ssr: {
    external: ["@remotion/bundler", "@remotion/renderer", "@remotion/lambda"],
  },
});
