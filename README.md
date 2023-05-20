Typescript/Javascript API Wrapper for accessing the REST API of an [LG ESS Home Energy Storage system](https://www.lg.com/de/business/ess-homeseries).

**Work in progress**

# range

    npm run start -s -- range pv 2023-05-02 2023-08-10

# graph

    ESS_PASSWORD="<password>" \
    ESS_IP="<ip>" \
    npm run start -s graph

Convert graph entries to CSV:

    npm run start -s -- graph | jq -rM '.loginfo[] | to_entries | map(.value)|@csv'

# info

Using [jq](https://jqlang.github.io/jq/)

    npm run start -s -- info | jq '.statistics.pcs_pv_total_power | tonumber' | figlet

# Other Projects & Links

- [pyess](https://www.lg.com/de/business/ess-homeseries) python library
- [lg-ess pv home assistant](https://github.com/Buktahula/hassio-addons)
- [English Manual](https://www.manualslib.de/manual/634794/Lg-Ess-Home-10.html#manual)
- [Installateur Manual (de)](https://www.lg.com/global/business/download/resources/ess/LG_ESS_Residential_EnerVu_Installer_Manual_DE.pdf)
