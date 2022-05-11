module.exports = {
  apps : [{
    name: 'hassil-dev',
    script: './app.js',
    watch: true,
    env_production: {
      STAGE: 'prod',
      NODE_ENV: 'production'
    }
  }]
};
