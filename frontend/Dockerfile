FROM node:20-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "4173"]
