const { LgEssApi } = require('../dist/lg-ess-api/api.js');

function main() {
  const api = new LgEssApi(process.env.ESS_IP);
  return api
    .login(process.env.ESS_PASSWORD)
    .then(() => api.home())
    .then((response) => console.log(response.data.statistics.pcs_pv_total_power))
}

main();
