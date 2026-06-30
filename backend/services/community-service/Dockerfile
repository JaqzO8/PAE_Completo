FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN mkdir -p uploads

EXPOSE 3002

CMD ["npm", "start"]
