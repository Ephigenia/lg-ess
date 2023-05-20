import { GRAPH_DEVICE, GRAPH_DEVICE_DEFAULT, GRAPH_TIMESPAN, GRAPH_TIMESPAN_DEFAULT, LgEssApi } from '../lg-ess-api/api';
import * as dotenv from 'dotenv';

function outputJSON(obj: any): void {
  const output = JSON.stringify(obj);
  process.stdout.write(output);
}

async function main(command = 'graph') {
  dotenv.config();
  const { ESS_PASSWORD = '', ESS_IP = '' } = process.env;

  const api = new LgEssApi(ESS_IP);
  await api.login(ESS_PASSWORD);

  switch(command) {
    default:
      process.stdout.write(`Unknown command "${JSON.stringify(command)}."`);
      break;

    case 'battery':
    case 'common':
    case 'home':
    case 'info':
    case 'network':
    case 'system': {
      const response = await api.state(command);
      outputJSON(response.data);
      break;
    }

    case 'range': {
      const device = process.argv[3] || GRAPH_DEVICE_DEFAULT;
      const start = new Date(process.argv[4]);
      const end = new Date(process.argv[5]);
      const data = await api.range(device as GRAPH_DEVICE, start, end);
      outputJSON(data);
      break;
    }

    case 'graph': {
      const device = process.argv[3] || GRAPH_DEVICE_DEFAULT;
      const timespan = process.argv[4] || GRAPH_TIMESPAN_DEFAULT;
      const date = new Date(process.argv[5] || Date.now());

      const response = await api.graph(
        device as GRAPH_DEVICE,
        timespan as GRAPH_TIMESPAN,
        date,
      );

      outputJSON(response.data);
      break;
    }
  }
}

try {
  main((process.argv[2] || '').toLowerCase());
} catch {
  console.log('ERROR');
}
