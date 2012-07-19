#!/bin/bash
GITHUB=https://github.com/dz0ny/youtube-dl-server

rm -rf ~/youtube-dl-server
mkdir ~/youtube-dl-server
cd ~/youtube-dl-server
curl -L $GITHUB/tarball/master -O ./youtube-dl-server.tar.gz
tar -zxvf ./youtube-dl-server.tar.gz --strip 1
rm ./youtube-dl-server.tar.gz
rm ./install.sh
chmod a+x ./youtube-dl-server