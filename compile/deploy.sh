#!/bin/bash

echo "type node: `type node`"

PM2_COMMAND=$1
SERVER_PORT=$2
STANDARD_NAME=html-to-pdf

echo "COMMAND ${PM2_COMMAND} / PORT ${SERVER_PORT}"

echo "NPM SOURCE"
npm config get registry

# install pm2-intercom module for recording log under cluster mode
pm2 describe pm2-intercom > /dev/null
if [ $? -ne 0 ]; then
  echo 'install pm2-intercom'
  pm2 install pm2-intercom
else
  echo 'pm2-intercome has running'
fi

# install pm2-logrotate module to rotate PM2 logs
# pm2 describe pm2-logrotate > /dev/null
if [ $? -ne 0 ]; then
  echo 'install pm2-logrotate'
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:compress true
else
  echo 'pm2-logrotate has running'
  pm2 set pm2-logrotate:compress true
fi

start () {
  echo 'RUN pm2 start ./pm2.config.json'
  export PORT=$SERVER_PORT
  pm2 start ./pm2.config.json
}

stop () {
  echo "RUN pm2 delete ${STANDARD_NAME}"
  pm2 delete $STANDARD_NAME
}

kill () {
  echo "RUN pm2 kill"
  pm2 kill
}

restart () {
  echo "RUN restart"
  pm2 describe $STANDARD_NAME > /dev/null
  if [ $? -eq 0 ]; then
    pm2 reload $STANDARD_NAME
  else
    start
  fi
}

case $PM2_COMMAND in
  start)
    start
    ;;
  stop)
    stop
    ;;
  kill)
    kill
    ;;
  restart)
    restart
    ;;
  *)
    ;;
esac

sleep 2
pm2 status
# 保存快照，可用 pm2 resurrect 快速恢复服务
pm2 save

npm run stop

npm run start