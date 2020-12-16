# 测试环境虚拟机部署脚本

cd `dirname $0`
cd ~/cloud-print-node

SERVER_PORT=$1

type node

npm install puppeteer --ignore-scripts
npm install
# npm run build

pm2 kill

# 睡眠，避免出现错误：Spawning PM2 daemon with pm2_home=/home/commercial-insurance-node/.pm2
sleep 2

export PORT=$SERVER_PORT
pm2 start pm2.test.config.json
