FROM node:18-alpine

WORKDIR /app

# Install dependencies required by Puppeteer
RUN apk add --no-cache \
  chromium \
  noto-sans-arabic \
  noto-sans-devanagari \
  noto-sans-georgian \
  noto-sans-hebrew \
  noto-sans-thai

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
