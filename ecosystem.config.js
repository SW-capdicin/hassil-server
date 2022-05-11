module.exports = {
  apps : [{
    name: 'hassil-dev',
    script: './app.js',
    watch: true,
    env: {
      STAGE: 'dev',
      NODE_ENV: 'production'
    }
  }]
};
