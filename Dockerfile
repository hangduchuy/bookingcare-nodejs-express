# chuẩn bị môi trường nodejs 
FROM node:14-alpine

# tạo thư mục app
WORKDIR /app/backend

# copy file package.json vào thư mục app
COPY package*.json ./

# chạy lệnh npm install
RUN npm install
RUN npm install -g @babel/cli @babel/core

# copy tất cả file trong thư mục hiện tại vào thư mục app
COPY . .
RUN npm run build-src

# chạy lệnh npm build
CMD ["npm", "run", "build"]

# docker build --tag node-docker .
# docker run -p 8080:8080 -d node-docker

