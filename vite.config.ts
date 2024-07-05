import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vitest/config";

// If you get "Plugin_2 is not assignable to PluginOption"
// try deleting node_modules and reinstalling
// In my case, installing with npm worked. Installing with yarn gave me the error.
export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
      autoInstall: true,
    }),
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
