#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

# Use the official Node.js 18 LTS image as the base image
FROM node:18-alpine As development

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files to the working directory
COPY --chown=node:node package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

######################
# BUILD FOR PRODUCTION
######################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --production --frozen-lockfile && yarn cache clean

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
