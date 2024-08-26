# Build the image. When complete, the bundled assets are available at `/project/build/`
FROM node:latest AS build
WORKDIR /project/
COPY . .
RUN npm install \
  && npm run build

# Inject built assets into an nginx image for serving
FROM nginx:latest AS app
COPY --from=build /project/build /etc/nginx/html/
