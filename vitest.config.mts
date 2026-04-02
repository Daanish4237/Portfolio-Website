import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@react-three/fiber": path.resolve(
        __dirname,
        "__mocks__/@react-three/fiber.tsx"
      ),
      "@react-three/drei": path.resolve(
        __dirname,
        "__mocks__/@react-three/drei.tsx"
      ),
      "framer-motion": path.resolve(__dirname, "__mocks__/framer-motion.tsx"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
