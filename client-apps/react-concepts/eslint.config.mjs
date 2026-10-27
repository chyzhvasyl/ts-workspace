import baseConfig from '../../eslint.config.mjs';

export default [...baseConfig, { ignores: ['vite.config.mts', 'vite.config.*.mts'] }];
