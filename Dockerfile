FROM node:18-alpine

EXPOSE 3000
WORKDIR /app
COPY . .

# Copy certificate file into the container
COPY ca.pem /usr/local/share/ca-certificates/ca.pem

# Update the certificates
RUN apk update && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates

RUN npm install
RUN npm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
RUN rm -f prisma/dev.sqlite

CMD ["npm", "run", "docker-start"]
