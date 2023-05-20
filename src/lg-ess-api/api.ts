import axios, { Axios } from 'axios';
import https from 'node:https';
import { AuthorizedRequestData, GRAPH_DEVICE, GRAPH_TIMESPAN, GraphBattItem, GraphLoadItem, GraphPVItem, GraphRequestData, GraphResponse, ISeetingSysteminfoResponseData, ISettingBatteryResponseData, ISettingCommonResponseData, ISettingHomeResponseData, ISettingNetworkResponseData, LoginResponseData } from './types';
export * from './types';

function dateToStr(date: Date): string {
  return date.toISOString().substring(0, 10).replace(/-/g,'')
}

export class LgEssApi {
  private client: Axios;
  private authKey?: string;

  public paths = {
    battery: '/user/setting/batt',
    common: '/user/essinfo/common',
    graph: '/user/graph/',
    home: '/user/essinfo/home',
    info: '/user/essinfo/home',
    login: '/user/setting/login',
    network: '/user/setting/network',
    system: '/user/setting/systeminfo',
  }

  constructor(ipOrHostname: string) {
    if (!ipOrHostname) {
      throw new Error('Required "ipOrHostname" not found.');
    }

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // ignore SSL cert checks
    })

    this.client = axios.create({
      httpsAgent: httpsAgent,
      baseURL: String(`https://${ipOrHostname}/v1`),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  // first time setup
  public async readPassword(ip: string): Promise<string> {
    const uri = `https://${ip}/v1/user/setting/read/password`;
    const body = { 'key': 'lgepmsuser!@#' };
    const headers = {
      'Charset': 'UTF-8',
    }
    return this.client.post<{ password: string, status: 'success' }>(uri, body, { headers })
      .then(response => response.data.password);
  }

  async login(password: string) {
    if (!password) {
      throw new Error('Required "password" not set');
    }
    const requestData = { password };
    const response = await this.client.put<LoginResponseData>(this.paths.login, requestData);
    this.authKey = response.data.auth_key;
    return this;
  }

  async state<T>(type: keyof typeof this.paths) {
    return this.postWithAuth<T>(this.paths[type]);
  }

  async battery() {
    return this.state<ISettingBatteryResponseData>('battery');
  }

  async home() {
    return this.state<ISettingHomeResponseData>('home');
  }

  async common() {
    return this.state<ISettingCommonResponseData>('common');
  }

  async network() {
    return this.state<ISettingNetworkResponseData>('network');
  }

  async system() {
    return this.state<ISeetingSysteminfoResponseData>('system');
  }

  private async postWithAuth<T>(uri: string) {
    const requestData: AuthorizedRequestData = { auth_key: this.authKey };
    return this.client.post<T>(uri, requestData);
  }

  async range(
    device: GRAPH_DEVICE,
    start: Date,
    end: Date,
  ) {
    const curDate = new Date(start.toISOString());
    let data: Array<GraphPVItem | GraphBattItem | GraphLoadItem> = [];
    while (curDate <= end) {
      curDate.setDate(curDate.getDate() + 1);
      const d = await this.graph(device, GRAPH_TIMESPAN.DAY, curDate);
      data = [...data, ...d.data.loginfo];
    }
    return data;
  }

  async graph(
    device: GRAPH_DEVICE,
    timespan: GRAPH_TIMESPAN,
    date: Date = new Date(),
  ) {
    const requestData: GraphRequestData = {
      auth_key: this.authKey,
    };

    switch(timespan) {
      case GRAPH_TIMESPAN.DAY:
      case GRAPH_TIMESPAN.WEEK:
        requestData.year_month_day = dateToStr(date).substring(0, 8);
        break;
      case GRAPH_TIMESPAN.MONTH:
        requestData.year_month = dateToStr(date).substring(0, 6);
        break;
      case GRAPH_TIMESPAN.YEAR:
        requestData.year = dateToStr(date).substring(0, 4);
        break;
    }

    const url = `${this.paths.graph}/${device}/${timespan}`;
    const response = await this.client.post<GraphResponse>(url, requestData)
    if (!response.data.loginfo) {
      response.data.loginfo = [];
    }
    response.data.loginfo.forEach(item => this.parseGraphItem(item));
    return response;
  }

  private parseGraphItem(item: GraphPVItem | GraphBattItem | GraphLoadItem) {
    item.date = this.strToDate(item.time);
    return item;
  }

  private strToDate(str: string): Date {
    const d = new Date();
    d.setUTCFullYear(parseInt(str.substring(0, 4), 10));
    d.setUTCMonth(parseInt(str.substring(4, 6), 10) - 1);
    d.setUTCDate(parseInt(str.substring(6, 8), 10));
    d.setUTCHours(parseInt(str.substring(8, 10), 10));
    d.setUTCMinutes(parseInt(str.substring(10, 12), 10));
    d.setUTCSeconds(parseInt(str.substring(12, 14), 10));
    d.setUTCMilliseconds(0);
    return d;
  }
}
