#!/bin/bash

echo "type node: `type node`"

export PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors

echo "开始 install"
npm install

# build application
# npm run build
