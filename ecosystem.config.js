module.exports = {
  apps : [{
    name: 'hassil-dev',
    script: 'app.js',
    watch: true,
    ignore_watch : ['node_modules'],
    env: {
      STAGE: 'dev',
      NODE_ENV: 'development'
    }
  }]
};
