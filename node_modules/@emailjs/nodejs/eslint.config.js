import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: './tsconfig.json',
      },
    },
    rules: {
      // validation function throw strings
      '@typescript-eslint/only-throw-error': 'off',
      // reject async function as part of logic
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
    },
  },
);
