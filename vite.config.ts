import { cloudflare } from "@cloudflare/vite-plugin";
import { unstable_reactRouterRSC as reactRouterRSC } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import rsc from "@vitejs/plugin-rsc";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      "wrangler:typegen": {
        command: "wrangler types",
        input: ["wrangler.json"],
        output: ["worker-configuration.d.ts"],
      },
      "react-router:typegen": {
        command: "react-router typegen",
        input: ["app/**"],
        output: [".react-router/**"],
      },
      build: {
        command: "react-router build",
        input: ["app/**"],
        output: ["build/**"],
        dependsOn: ["wrangler:typegen", "react-router:typegen"],
      },
      "check:fix": {
        command: "vp check --fix",
        cache: false,
        dependsOn: ["wrangler:typegen", "react-router:typegen"],
      },
    },
  },
  fmt: { ignorePatterns: ["drizzle/**", "worker-configuration.d.ts"] },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
      reportUnusedDisableDirectives: "warn",
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
    tailwindcss(),
    reactRouterRSC(),
    rsc({
      // Workaround: Disable the default server handler from @vitejs/plugin-rsc.
      // In preview mode, the plugin tries to import the built RSC entry in Node.js,
      // which fails if your entry uses `cloudflare:*` imports (e.g., Durable Objects).
      // The Cloudflare plugin handles requests via workerd instead, so this is safe.
      serverHandler: false,
    }),
    devtoolsJson(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  environments: {
    // Workaround: Exclude react-router from dependency optimization in worker environments.
    // The reactRouterRSC plugin adds react-router to optimizeDeps.include at the root level
    // (intended for the client), but this can cause duplicate React instances in the rsc/ssr
    // environments running inside workerd, leading to "Invalid hook call" errors on first load.
    rsc: {
      optimizeDeps: {
        exclude: ["react-router"],
      },
    },
    ssr: {
      optimizeDeps: {
        exclude: ["react-router"],
      },
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
