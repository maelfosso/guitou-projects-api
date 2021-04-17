FROM node:14.6.0

WORKDIR /src

# ADD wait-for-it.sh wait-for-it.sh
# RUN chmod +x /src/wait-for-it.sh

ADD package*.json /src/
RUN npm install --silent

ADD . /src

EXPOSE 3000

CMD npm start
