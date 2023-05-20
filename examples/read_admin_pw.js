const { LgEssApi } = require('../dist/lg-ess-api/api.js');

function main() {
  const api = new LgEssApi(process.env.ESS_IP);
  return api.readPassword().then(password => {
    console.log('The admin password of the LG ESS is: "%s"', password);
  })
}

main();
