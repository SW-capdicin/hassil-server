module.exports = {
  apps : [{
    name: 'hassil-dev',
    script: './app.js',
    watch: true,
    cwd: '/root/hassil/jenkins-server',
    env: {
      STAGE: 'dev',
      NODE_ENV: 'development'
    }
  }]
};
