## docker build -t dyrtransportes-nginx:1.10.0 -f docker/Dockerfile .
## or ${REGISTRY}/dyrtransportes/dyrtransportes-react:1.10.0

### for arm
#docker buildx build --builder=my_builder --platform linux/amd64,linux/arm64 -t 192.168.100.15/dyrtransportes/dyrtransportes-react:1.10.0 -f docker/Dockerfile --push .

FROM node:22.14.0-slim AS builder

RUN npm install -g pnpm

COPY . .
RUN rm -rf dist/ node_modules/ && \
    pnpm install --frozen-lockfile && \
    pnpm run build

FROM nginx:1.27.4-bookworm-perl AS nginx

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY docker/entrypoint.sh .
RUN chmod +x /entrypoint.sh

COPY --from=builder dist /usr/share/nginx/html

CMD ["/entrypoint.sh"]