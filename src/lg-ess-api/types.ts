export interface LoginResponseData {
  auth_key: string
  regnum: string
  role: 'user'
  status: 'success'
}

export interface ISettingNetworkResponseData {
  type: 'wired',
  setting: 'auto',
  /** local network IP, 192.168.178.169 */
  ip: string,
  /** netmast 255.255.255.0 */
  mask: string,
  /** local network gateway address, 192.168.178.1 */
  gateway: string,
  /** IP of DNS server, 192.168.178.1 */
  dns: string,
  registered: 0,
  connected: 'internet_connected',
  remote_control: 0,
  drmcontrol: 0,
  pms_orient: 0
}

export interface ISeetingSysteminfoResponseData {
  pms: {
    model: string
    serialno: string
    ac_input_power: number
    ac_output_power: number
    /** 2018-01-01 */
    install_date: string
  }
  batt: {
    capacity: string
    /** 2023-04-21 */
    install_date: string
  }
  version: {
    /** 10.05.7289 */
    pms_version: string
    /** 2022-04-07 R1537 */
    pms_build_date: string
    /** LG 05.00.01.00 R143 1.139.3 */
    pcs_version: string
    /** BMS 00.03.01.07  */
    bms_version: string
    /** BMS 00.03.01.07  */
    bms_unit1_version: string
    bms_unit2_version: string
  }
}

export interface ISettingCommonResponseData {
  BATT: Record<string, string>
  GRID: Record<string, string>
  LOAD: Record<string, string>
  PCS: Record<string, string>
  PV: Record<string, string>
}

export interface ISettingHomeResponseData {
  backupmode: string
  direction: {
    is_direct_consuming_: '1' | '0',
    is_battery_charging_: '1' | '0',
    is_battery_discharging_: '1' | '0',
    is_grid_selling_: '1' | '0',
    is_grid_buying_: '1' | '0',
    is_charging_from_grid_: '1' | '0',
    is_discharging_to_grid_:'1' | '0'
  }
  evcharger: Record<string, string>
  gridWaitingTime: string
  heatpump: Record<string, string>
  operation: {
    status: 'start',
    mode: '1',
    pcs_standbymode: "true" | "false",
    drm_mode0: '0' | '1',
    remote_mode: '0' | '1',
    drm_control: '0' | '1'
  }
  pcs_fault: Record<string, string>
  statistics: {
    pcs_pv_total_power: string,
    batconv_power: string,
    bat_use: string,
    bat_status: string,
    bat_user_soc: string,
    load_power: string,
    ac_output_power: string,
    load_today: string,
    grid_power: string,
    current_day_self_consumption: string,
    current_pv_generation_sum: string,
    current_grid_feed_in_energy: string
  },
  windermode: Record<string, string>
}

export interface ISettingBatteryResponseData {
  alg_setting: "battery_care"
  backup_setting: 'off' | 'on'
  backup_soc: number
  backup_status: 'off' | 'on'
  enervu_activated: 'false' | 'true'
  enervu_upload: 'off' | 'on'
  internet_connection: "connected"
  /** minimum battery state of charge level */
  safety_soc: number
  /** wintermode start month & day "1101" */
  startdate: string
  /** wintermode end month & day "0228" */
  stopdate: string
  /** should winter mode automatically turn on between start and enddate? */
  winter_setting: 'off' | 'on'
  /** current state of the winter mode */
  winter_status: 'off' | 'on'
}

export interface AuthorizedRequestData {
  auth_key?: string
}

export interface GraphRequestData extends AuthorizedRequestData {
  year_month_day?: string
  year_month?: string
  year?: string
}

export enum GRAPH_TIMESPAN {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'month',
  WEEK = 'week',
}
export const GRAPH_TIMESPAN_DEFAULT = GRAPH_TIMESPAN.MONTH;
export enum GRAPH_DEVICE {
  PV = 'pv',
  LOAD = 'load',
  BATT = 'batt',
}
export const GRAPH_DEVICE_DEFAULT = GRAPH_DEVICE.PV;

export interface GraphResponse {
  db: string
  loginfo: GraphPVItem[] | GraphBattItem[] | GraphLoadItem[]
  m_timeFrom: string // 20230501000000
  m_timeTo: string // 20230501000000
}

export interface GraphItem {
  db: string
  time: string // 20230501000000
  date: Date
}

export interface GraphPVItem extends GraphItem {
  /** watt fed into the grid */
  feed_in: string
  /** watt generated */
  generation: string
  /** percent of pv energy that was consumed */
  self_consum: string
  total_Feed_in: string
  total_generation: string
  total_pv_direct_consumption_energy: string
}

export interface GraphBattItem extends GraphItem {
  charge: string
  discharge: string
  total_charge: string
  total_discharge: string
  soc: string
}

export interface GraphLoadItem extends GraphItem {
  consumption: string
  purchase: string
  self_suffi: string
  total_consumption: string
  total_purchase: string
}
