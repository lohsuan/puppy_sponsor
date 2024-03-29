FROM node:alpine

ARG WORKPLACE=/puppy-sponsor

COPY ./ $WORKPLACE

WORKDIR $WORKPLACE

RUN npm i -g pnpm@6 serve && \
    pnpm setup && \
    pnpm i --frozen-lockfile &&  \
    pnpm build

RUN mkdir ../to_rm && \
    mv ./* ../to_rm && \
    mv ../to_rm/dist ./ && \
    rm -rf ../to_rm

ENV NODE_ENV=production

# The default export port will be set to 3000.
CMD ["serve", "-s", "dist", "-C"]
