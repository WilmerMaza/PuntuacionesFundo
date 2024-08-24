FROM node:18-alpine

RUN mkdir -p /home/app

WORKDIR /home/app

COPY  . /home/app

RUN npm install

RUN npm run build

EXPOSE 3004

CMD ["npm", "--", "run", "start"]
