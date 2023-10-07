FROM node:18-alpine3.17
WORKDIR /app
COPY . .

ENV DB_HOST=DB_HOST_VALUE
ENV DB_USER=DB_USER_VALUE
ENV DB_PASSWORD=DB_PASSWORD_VALUE
ENV DB_PORT=DB_PORT_VALUE
ENV DB_SID=DB_SID_VALUE
ENV LD_LIBRARY_PATH=/app/instantclient_19_3:/lib64:/lib//usr/lib:/lib64:$LD_LIBRARY_PATH

RUN unzip instantclient-basic-linux.x64-19.3.0.0.0dbru.zip && \
    cp -r instantclient_19_3/* /lib && \
    rm -rf instantclient-basic-linux.x64-19.3.0.0.0dbru.zip && \
    apk add libaio libnsl libc6-compat
RUN cp /usr/lib/libnsl.so.3 /lib/libnsl.so.1 && \
    ln -s /lib/libc.so.6 /usr/lib/libresolv.so.2

RUN npm install
RUN npm install oracledb
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run","start:prod" ]