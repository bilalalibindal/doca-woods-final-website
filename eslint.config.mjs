import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "app/generated/**",
    ],
  },
  {
    rules: {
      // Kullanılmayan değişkenleri warning olarak göster (error değil)
      "@typescript-eslint/no-unused-vars": "warn",
      // Kullanılmayan ifadeleri kapat
      "@typescript-eslint/no-unused-expressions": "off",
      // `any` tipini warning olarak göster (error değil)
      "@typescript-eslint/no-explicit-any": "warn",
      // HTML entity warning'lerini kapat
      "react/no-unescaped-entities": "warn",
      // Alt text warning'ini kapat
      "jsx-a11y/alt-text": "warn",
    },
  },
];

export default eslintConfig;
