FROM amd64/node:latest

RUN mkdir -p /home/app

COPY . /home/app

WORKDIR /home/app

EXPOSE 3000

RUN npm install
# wait for db initializtion
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/bin/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh

CMD ["wait-for-it.sh", "member_prod_ec2_db:3306", "--timeout=20", "--strict", "--", "npm", "run", "prod"]