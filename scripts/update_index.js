// Adapted from pelias-schema https://github.com/pelias/schema 

const child_process = require('child_process');
const config = require('pelias-config').generate();
const es = require('elasticsearch');
const SUPPORTED_ES_VERSIONS = '>=7.4.2';

const cli = require('./cli');
const schema_gh = require('../schema');

cli.header('Update index');

const client = new es.Client(config.esclient);

// check minimum elasticsearch versions before continuing
try {
  child_process.execSync(`node ${__dirname}/check_version.js "${SUPPORTED_ES_VERSIONS}"`);
} catch (e) {
  console.error(`unsupported elasticsearch version. try: ${SUPPORTED_ES_VERSIONS}\n`);
  process.exit(1);
}

const indexName = config.schema.indexName;

// verify that the index already exists
let req = { index: indexName };
client.indices.exists(req, (err, res) => {
  if (err) {  
    console.error(err.message || err, '\n');
    process.exit(1);
  }
  console.log('[index exists]', '\t', indexName, res, '\n');
});

// update pelias schema
req = {
  index: indexName,
  body: schema_gh
};
client.indices.putMapping(req, (err, res) => {
  if (err) {
    console.error(err.message || err, '\n');
    process.exit(1);
  }
  console.log('[update mapping]', '\t', indexName, res, '\n');
  process.exit(!!err);
});