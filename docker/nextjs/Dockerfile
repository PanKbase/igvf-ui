FROM node:20.10.0-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}

WORKDIR /docker

COPY ./docker/nextjs/entrypoint.sh .

RUN chmod +x ./entrypoint.sh

WORKDIR /igvf-ui

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["npm", "run", "start"]
