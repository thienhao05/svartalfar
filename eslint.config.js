import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'node_modules/', '.claude/', '.agent/'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
);
