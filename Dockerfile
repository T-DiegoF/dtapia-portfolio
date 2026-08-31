# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------
# Production image: build the Angular app, serve it with nginx.
# Node 24.20 (LTS Krypton) satisfies Angular 22's engine range
# (^22.22.3 || ^24.15.0 || >=26.0.0).
# ---------------------------------------------------------------

FROM node:24.20.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:24.20.0-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.title="dtapia-portfolio"
LABEL org.opencontainers.image.description="Diego Tapia - portfolio (Angular 22)"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist/dtapia-portfolio/browser /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
