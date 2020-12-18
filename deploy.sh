# 部署脚本
type node

npm install puppeteer --ignore-scripts
npm install

pm2 kill

# 睡眠，避免出现错误：Spawning PM2 daemon with pm2_home
sleep 2

pm2 start pm2.config.json
