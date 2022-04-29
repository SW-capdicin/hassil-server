echo "> test code"
pm2 start app.js
pm2 reload all
pm2 list