export const examples = {
    StnMeta: [
      {'title': 'Basic metadata for a single station.', 'params': '{"sids":"304174"}'},
      {'title': 'Metadata for all stations in a county.', 'params': '{"county":"36001"}'},
      {'title': 'All stations in Delaware Climate Division 1 that have reported snowfall (csv output)',
       'params': '{"climdiv":"DE01","elems":"snow","output":"csv"}'},
      {'title': 'State/valid date range/station name for all stations that are in both the Boston CWA and either CT or RI that reported max or min temperature on June 10, 2021.',
       'params': '{"state":["CT","RI"],"cwa":"box","elems":["maxt","mint"],"date":"2021-06-10","meta":["name","state","valid_daterange"]}'},
    ],
    StnData:[
      {'title': 'Daily max and min temperature, precipitation, snowfall and snow depth for a range of days (csv output).', 
       'params': '{"sid":"304174","sdate":"2009-01-01","edate":"2009-01-10","elems":"1,2,4,10,11","output":"csv"}'},
      {'title': '1991-2020 normal, 1981-2010 normal, and observed 2022 monthly precipitation.',
       'params': '{"sid":"las","sdate":"2022-1","edate":"2022-12","elems":[{"name":"pcpn","interval":[0,1],"duration":1,"normal":"1"},{"name":"pcpn","interval":[0,1],"duration":1,"normal":"81"},{"name":"pcpn","interval":[0,1],"duration":1,"reduce":"sum"}],"meta":"[]"}'},
      {'title': 'Top 10 snowiest seasons (Oct-May) for the period of record with year of occurrence and also period of record mean.',
       'params': '{"sid":"KSYR","sdate":"por-5-31","edate":"por-5-31","meta":"name","elems":[{"name":"snow","interval":[1,0,0],"duration":"std","season_start":[10,1],"maxmissing":1,"reduce":{"add":"mcnt","reduce":"sum"},"smry":{"add":"mcnt,date","n":"10","reduce":"max"},"smry_only":"1"},{"name":"snow","interval":[1,0,0],"duration":"std","season_start":[10,1],"maxmissing":1,"reduce":"sum","smry":"mean","smry_only":"1"}]}'},
      {'title': 'Date of the last "spring" (July 1-June 30) temperature <= 28 degrees for the years 1991-2000. Also report what the min temperature was on that date.',
       'params': '{"sid":"118740","sdate":"1991-6-30","edate":"2000-6-30","elems":[{"name":"mint","interval":[1,0,0],"duration":"std","season_start":[7,1],"reduce":{"reduce":"last_le_28","add":"value"}}],"meta":"name,state"}'},
    ],
    MultiStnData:[
      {'title': 'Annual precipitation totals and count of missing days (max 7) for all stations in a bounding box. Also calculate mean for period.',
       'params': '{"bbox":"-102,48,-98,50","sdate":"2008-01","edate":"2010-12","meta":"name,state,ll","elems":[{"name":"pcpn","interval":[1],"duration":1,"reduce":{"reduce":"sum","add":"mcnt"},"maxmissing":7,"smry":"mean"}]}'
      }
    ],
    GridData:[
      {'title': 'Map of highest max temperature for June 2012 in Nebraska',
       'params': '{"state":"ne","grid":"1","output":"json","date":"2012-6","elems":[{"name":"maxt","interval":"mly","duration":"mly","reduce":"max"}],"image":{"proj":"lcc","overlays":["county:1:gray","state:2:purple"],"interp":"cspline","width":350,"levels":[90,95,100,105,110]}}'},
    ],
    GridData2:[
      {'title': 'Nested example: 30-year mean (1991-2020) of total precitation for the 30-day periods ending on February 15 of each year.',
       'params': '{"loc":"-75.2,42.5","date":"2020-02-15","grid":"nrcc-nn","elems":[{"elem":{"name":"pcpn","interval":[1,0,0],"duration":30,"reduce":"sum"},"interval":[1],"duration":30,"reduce":"mean"}]}'},
    ],
    StnHourly:[
      {'title': 'Houly precipitation for February 22, 2023.',
       'params': '{"sid":"kord","elems":[{"vX":5}],"date":"2023-2-22"}',
      }
    ],
    General:[
      {'title': 'Postal id, name and bounding box for New York State.',
       'generalArea': 'state',
       'params': '{"meta":"id,name,bbox","state":"ny"}'},
      {'title': 'State, FIPS id and name for all counties in a bounding box.',
       'generalArea': 'county',
       'params': '{"meta":"state,id,name","bbox":"-76,41,-75,42"}'},
      {'title': 'Division name and geojson for Nebraska climate division 1.',
       'generalArea': 'climdiv',
       'params': '{"meta":"name,geojson","id":"NE01"}'},
      {'title': 'CWA id, name and bounding box of all CWAs covering any part of Louisiana.',
       'generalArea': 'cwa',
       'params': '{"meta":"id,name,bbox","state":"la"}'},
      {'title': '8-digit HUC id and name of all river basins in a bounding box.',
       'generalArea': 'basin',
       'params': '{"meta":"id,name","bbox":"-75,40,-72,42"}'},
    ],
  }