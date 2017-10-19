## install update node

## install nginx
reverse proxy using nginx

## install postgres
create root user

sudo -u postgres createuser --interactive
    (username : root, superuser: y)

psql postgres;

    create database X
    ALTER USER "root" WITH PASSWORD 'new_password';
    \q


knex migrate:latest

## add deployment keys to github
rsa-keygen

cd ~/.ssh/ rsa.pub

copy and paste into github

## install globals
knex pm2

## npm install

## set environment to production

/etc/environment

    NODE_ENV="production"

## pm2 start

`pm2 start app.js`

