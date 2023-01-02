FROM node:18
WORKDIR /usr/projects/studies/ts-tdd-ddd-clean_architecture-solid
COPY package.json .
RUN npm install --omit=dev