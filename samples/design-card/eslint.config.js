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
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // ACE samples load image assets via require(); allow it.
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];
