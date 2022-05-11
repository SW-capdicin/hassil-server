module.exports = {
  apps : [{
    name: 'hassil-prod',
    script: './app.js',
    watch: true,
    env_production: {
      STAGE: 'prod',
      NODE_ENV: 'production'
    }
  }]
};
