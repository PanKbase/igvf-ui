FROM node:20.10.0-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /docker

COPY ./docker/nextjs/entrypoint.sh .

RUN chmod +x ./entrypoint.sh

WORKDIR /igvf-ui

COPY package*.json ./

RUN npm ci

COPY . .

# Inlined into the client bundle by `next build`; set per environment by CDK.
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["npm", "run", "start"]
