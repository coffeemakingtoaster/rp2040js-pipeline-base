FROM node:20

WORKDIR /app

COPY . . 

RUN npm ci --audit=false

CMD ["npm", "start"]