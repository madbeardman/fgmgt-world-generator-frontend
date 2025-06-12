// @ts-check
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  output: "server", // Required for SSR features like /api/generate-stream
  adapter: vercel({}),
});