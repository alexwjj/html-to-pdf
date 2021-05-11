# 测试环境虚拟机部署脚本

cd `dirname $0`
cd ~/html-to-pdf

SERVER_PORT=$1

type node

# npm install puppeteer --ignore-scripts
npm install
# npm run build

pm2 kill

# 睡眠，避免出现错误
sleep 2

export PORT=$SERVER_PORT
pm2 start pm2.test.config.json
