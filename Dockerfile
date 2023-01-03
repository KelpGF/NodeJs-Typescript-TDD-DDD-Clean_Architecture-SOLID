FROM node:18
WORKDIR /usr/src/studies/ts-tdd-ddd-clean_architecture-solid
COPY package.json .
RUN npm install --omit=dev