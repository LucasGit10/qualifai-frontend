#!/bin/sh
set -eu

: "${BACKEND_UPSTREAM:?BACKEND_UPSTREAM is required}"
sed -i "s|__BACKEND_UPSTREAM__|${BACKEND_UPSTREAM}|g" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'