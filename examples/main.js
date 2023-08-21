const GCPProcessCredentials = require('gcp_process_credentials');

// let targetClient = new GCPProcessCredentials({
//   cmd: "/usr/bin/cat",
//   args: ["/tmp/token.txt"],
//   env : {'foo': 'bar'},
//   parser: null
// });

class gcloudParser {
  constructor() {}
  parse(i) {
    return '{ "access_token": "' + i.toString().replace(/\n$/, '') +'", "expires_in": 3600, "token_type": "Bearer" }' 
  }
}

let targetClient = new GCPProcessCredentials({
    cmd: "gcloud",
    args: ["auth", "print-access-token"],
    parser:  new gcloudParser()
  });

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'core-eso',
  authClient: targetClient,
});

async function listBuckets() {
  const [buckets] = await storage.getBuckets();

  console.log('Buckets:');
  buckets.forEach(bucket => {
    console.log(bucket.name);
  });
}

listBuckets().catch(console.error);