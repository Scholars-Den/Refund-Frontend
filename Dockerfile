FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ARG VITE_APP_API_URL
ARG VITE_APP_SCHOLARSDEN_API_URL
ENV VITE_APP_API_URL=${VITE_APP_API_URL}
ENV VITE_APP_SCHOLARSDEN_API_URL=${VITE_APP_SCHOLARSDEN_API_URL}
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
