
"use strict";


const oauth2client_1 = require('google-auth-library');
const util = require('util');

exports.PROCESS_CREDENTIAL_TYPE = 'process_credentials';

class GCPProcessCredentials extends oauth2client_1.OAuth2Client {
  constructor(options = {}) {
    super(options);
    this.credentials = { expiry_date: 1, refresh_token: 'process-credentials-placeholder' };
    this.cmd = options.cmd;
    this.args = options.args;
    this.env = options.env;
    this.parser = options.parser;
    this.timout_ms = 2000 //todo: allow override
  }

  async refreshToken(refreshToken) {

    if (this.credentials.expiry_date <= (Math.floor((new Date()).getTime() / 1000))) {
      try {
        const cp = require('child_process');
        let res = cp.execSync(this.cmd + ' ' + this.args.join(' '), { env: this.env, timeout: this.timout_ms });

        if (this.parser != null) {
          res = this.parser.parse(res)
        }
        const tokenResponse = JSON.parse(res.toString());
        this.credentials.access_token = tokenResponse.access_token
        this.credentials.expiry_date = Date.parse(new Date(new Date().getTime() + (1000 * tokenResponse.expires_in)))
        this.credentials.token_type = tokenResponse.token_type
        return { 'tokens': this.credentials, 'res': null };
      }
      catch (error) {
        console.log(error)
        throw error
      }
    }
  }
}


module.exports = GCPProcessCredentials



