const spfxProfile = require('@microsoft/eslint-config-spfx/lib/flat-profiles/react');

module.exports = [
  ...spfxProfile,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json'
      }
    },
    // These rules flag long-standing SPFx sample patterns (require() for bundled
    // assets/mock JSON, forward type references). Downgraded to warnings so the
    // 1.23 build passes without rewriting working sample logic.
    rules: {
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-use-before-define': 'warn'
    }
  }
];
