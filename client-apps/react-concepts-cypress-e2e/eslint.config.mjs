import baseConfig from '../../eslint.config.mjs';

export default [...baseConfig, { ignores: ['cypress.config.ts', 'cypress.config.*.ts'] }];
