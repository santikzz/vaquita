#!/bin/bash
set -e
service cron start
php artisan config:cache
php artisan storage:link || true
php artisan migrate --force
chown -R www-data:www-data storage/logs
supervisord -n -c /etc/supervisor/supervisord.conf