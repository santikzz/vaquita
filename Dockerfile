FROM oven/bun:1 AS frontend-builder
WORKDIR /app
ARG VITE_APP_NAME
ENV VITE_APP_NAME=${VITE_APP_NAME}
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=${VITE_TURNSTILE_SITE_KEY}
COPY package.json tsconfig.json vite.config.ts eslint.config.js ./
RUN bun install
COPY resources ./resources
COPY public ./public
RUN bun run build
FROM dunglas/frankenphp:1-php8.4
WORKDIR /var/www/html
RUN apt-get update && apt-get install -y git curl libpng-dev libonig-dev libxml2-dev libwebp-dev libjpeg62-turbo-dev libfreetype6-dev zip unzip libzip-dev cron supervisor && rm -rf /var/lib/apt/lists/*
RUN install-php-extensions pdo_mysql mbstring exif pcntl bcmath gd zip redis opcache pdo_pgsql pgsql
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views && mkdir -p storage/app/private storage/app/public && mkdir -p bootstrap/cache && chown -R www-data:www-data storage bootstrap/cache && chmod -R 775 storage bootstrap/cache
COPY --chown=www-data:www-data composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-interaction --prefer-dist --no-scripts
COPY --chown=www-data:www-data . .
COPY --from=frontend-builder /app/public/build ./public/build
RUN composer run-script post-autoload-dump
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN echo "* * * * * www-data cd /var/www/html && /usr/local/bin/php artisan schedule:run >> /var/www/html/storage/logs/scheduler.log 2>&1" > /etc/cron.d/laravel-scheduler && chmod 0644 /etc/cron.d/laravel-scheduler && crontab /etc/cron.d/laravel-scheduler
EXPOSE 80 443
RUN php artisan route:cache && php artisan view:cache
COPY docker/startup.sh /startup.sh
RUN chmod +x /startup.sh
CMD ["/startup.sh"]