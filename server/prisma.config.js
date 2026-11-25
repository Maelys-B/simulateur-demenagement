require('dotenv').config();
const { defineConfig } = require('prisma/config');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `mysql://${DB_USER}:${encodeURIComponent(DB_PASSWORD ?? '')}@${DB_HOST}:3306/${DB_NAME}`,
  },
});
