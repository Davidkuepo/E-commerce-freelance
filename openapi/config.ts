import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi/main.yaml",
  output: "./src/services/main",
  plugins: [
    "@hey-api/client-axios",
    {
      enums: "typescript",
      name: "@hey-api/typescript",
    },
    {
      asClass: true,
      name: "@hey-api/sdk",
    },
  ],
});
