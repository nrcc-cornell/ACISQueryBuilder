import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const tabledata = {
  nohelp: {
    heads: [],
    contents: [[]],
    foots: "No help available for this item"
  },
  sids: {
    heads: ["Type", "Code ", "Description", "Example"],
	  contents: [
      ["WBAN", "1", "5-digit WBAN id", "14742"],
      ["COOP", "2", "6-digit COOP id", "304174"],
      ["FAA", "3", "3-character FAA id", "LAX"],
      ["WMO", "4", "5-digit WMO id", "72223"],
      ["ICAO", "5", "4-character ICAO id", "KGRR"],
      ["GHCN", "6", "11-character GHCN id", "USW00003927"],
      ["NWSLI", "7", "5-character NWSLI", "AURN6"],
      ["THRDX", "9", "6-character ThreadEx id", "HSVthr"],
      ["COCORAHS", "10", "8-character CoCoRaHS id", "NYTM0004"],
      ["SCAN", "17", "SCAN", "15"],
      ["TSCAN", "19", "TSCAN", "3001"],
    ],
    foots: "To avoid ambiguity, station id should be specified by station id and id code (or type) separated by a space (e.g. 'KGRR 5')"
  },
  hrly_sid: {
    heads: ["Type", "Code ", "Description", "Example"],
	  contents: [
      ["WBAN", "1", "5-digit WBAN id", "14742"],
      ["COOP", "2", "6-digit COOP id", "304174"],
      ["FAA", "3", "3-character FAA id", "LAX"],
      ["WMO", "4", "5-digit WMO id", "72223"],
      ["ICAO", "5", "4-character ICAO id", "KGRR"],
      ["GHCN", "6", "11-character GHCN id", "USW00003927"],
      ["NWSLI", "7", "5-character NWSLI", "AURN6"],
      ["DEOS", "11", "Delaware DEOS id", "DAGF"],
      ["MIWX", "13", "Michigan Enviroweather", "KZO"],
      ["SCAN", "17", "SCAN", "2011"],
      ["TSCAN", "19", "TSCAN", "3052"],
      ["OARDC", "22", "Ohio OARDC id", "ASHT"],
      ["NEWA", "26", "NEWA id", "GEN"],
      ["CU_LOG", "27", "Cornell WxNet id", "CU_GFR"],
      ["NJWX", "28", "NJ WxNet id", "1101"],
    ],
    foots: "To avoid ambiguity, station id should be specified by station id and id type (or code) separated by a space (e.g. 'KGRR icao')"
  },
  county: {
    heads: ["Description", "Examples"],
    contents: [
      ["One or more county FIPS codes ", "09001"],
    ]
  },
  climdiv: {
    heads: ["Description", "Examples"],
    contents: [
      ["One or more climate division (2-digits or combined with state) ", "10 or NY10"],
    ]
  },
  cwa: {
    heads: ["Description", "Examples"],
    contents: [
      ["One or more NWS County Warning Areas", "BOI"],
    ]
  },
  basin: {
    heads: ["Description", "Examples"],
    contents: [
      ["One or more drainage basins (8-digit HUC) ", "01080205"],
    ]
  },
  state: {
    heads: ["Description", "Examples"],
    contents: [
      [ "One or more 2-letter state postal abbreviations", "AK"],
    ]
  },
  bbox: {
    heads: ["Description", "Examples"],
    contents: [
      ["Bounding box in decimal degrees (W,S,E,N) ", "-90, 40, -88, 41"]
    ]
  },
  grid2_bbox: {
    heads: ["Description", "Examples"],
    contents: [
      ["Bounding box in decimal degrees (W,S,E,N) ", "-90, 40, -88, 41"]
    ],
    foots: "An empty bounding box, [], will return the entire grid array",
  },
  meta: {
    heads: ["Code","Description"],
    contents: [
      ["name","Station name *"],
      ["state","2-letter state abbrev *"],
      ["sids","Array of station ids/types *"],
      ["sid_dates","Date range for each sid"],
      ["ll","Longitude and latitude *"],
      ["elev","Elevation *"],
      ["uid","ACIS id *"],
      ["county","5-digit FIPS id"],
      ["climdiv","4-character climate division id"],
      ["valid_daterange","Valid date range (by element) - must specify Elements"],
      ["tzo","Time zone offset from GMT"],
      ["network","Station networks"],
    ],
  foots: "Values with an asterisk (*) indicate defaults used if 'meta' is not explicityly specified."
  },
  elems: {
    heads: ["Abbreviation","Var Major","Description"],
    contents: [
      ["maxt","1","Maximum temperature (&deg;F)"],
      ["mint","2","Minimum temperature (&deg;F)"],
      ["avgt","43","Average temperature (&deg;F)"],
      ["obst","3","Obs time temperature (&deg;F)"],
      ["pcpn","4","Precipitation (inches)"],
      ["snow","10","Snowfall (inches)"],
      ["snwd","11","Snow Depth (inches)"],
      ["(not available)","7","Pan evaporation (inches)"],
      ["cdd","","Cooling degree days (default base 65)"],
      ["hdd","45","Degree days below base (default base 65)"],
      ["gdd","44","Degree days above base (default base 50)"],
    ],
  },
  vX: {
    heads: ["Variable", "vX", "Networks found"],
    contents: [
      ["Precipitation", "5", "newa, icao, cu_log, njwx, miwx, oardc, scan, tscan"],
      ["Temperature", "23", "newa, icao, njwx, oardc, deos, scan, tscan"],
      ["Average temperature", "126", "newa, cu_log, njwx, miwx"],
      ["Max temperature", "124", "newa, cu_log, njwx, scan, tscan"],
      ["Min temperature", "125", "newa, cu_log, njwx, scan, tscan"],
      ["Relative humidity", "24", "newa, icao, njwx, oardc, cu_log, deos, scan, tscan"],
      ["Average relative humidity", "143", "newa, njwx, miwx"],
      ["Max relative humidity", "141", "newa, njwx"],
      ["Min relative humidity", "143", "newa, njwx"],
      ["Dewpoint temperature", "22", "icao, newa, deos"],
      ["Average dewpoint temperature", "140", "njwx"],
      ["Max dewpoint temperature", "138", "njwx"],
      ["Min dewpoint temperature", "139", "njwx"],
      ["Wet-bulb temperature", "25", "icao"],
      ["Wind speed", "28", "icao, njwx, oardc, deos"],
      ["Average wind speed", "128", "newa, njwx, cu_log, scan, tscan"],
      ["Resultant wind speed", "129", "cu_log"],
      ["Max wind speed", "42", "icao, cu_log, njwx, scan, tscan"],
      ["Wind gust", "85", "icao"],
      ["Wind direction", "27", "icao, njwx, oardc, deos"],
      ["Average wind direction", "130", "newa, cu_log, scan, tscan"],
      ["Peak wind direction", "41", "njwx, icao"],
      ["Total sky cover", "33", "icao"],
      ["Solar radiation total", "132", "newa, cu_log, miwx, oardc, deos"],
      ["Solar radiation rate", "119", "njwx"],
      ["Average solar radiation rate", "149", "njwx, scan, tscan"],
      ["Max solar radiation rate", "147", "njwx"],
      ["Min solar radiation rate", "148", "njwx"],
      ["Leaf wetness", "118", "newa, cu_log, njwx, miwx, oardc, deos"],
      ["Soil temperature", "120", "newa, oardc, deos, scan, tscan"],
      ["Average soil temperature", "123", "cu_log"],
      ["Max soil temperature", "121", "newa, deos, oardc, cu_log"],
      ["Min soil temperature", "122", "newa, deos, oardc, cu_log"],
      ["Soil moisture", "104", "deos, scan, tscan"],
      ["Soil tension", "65", "newa"],
      ["Station pressure", "18", "icao, newa, njwx, deos"],
      ["Average station pressure", "146", "newa, njwx"],
      ["Max station pressure", "144", "newa, njwx"],
      ["Min station pressure", "145", "newa, njwx"],
      ["Sea level pressure", "19", "icao"],
      ["Altimeter setting", "17", "icao"],
      ["Visibility", "26", "icao"],
      ["Ceiling height", "35", "icao"],
      ["3-hour precipitation", "36", "icao"],
      ["6-hour precipitation", "37", "icao"],
      ["6-hour max temperature", "39", "icao"],
      ["6-hour min temperature", "40", "icao"],
    ],
  },
  vN: {
    contents: [
      ["Some elements require a var minor (vN). A list of vN can be found at https://github.com/rcc-acis/metadata/blob/master/data/global_variable_maj_min.load."],
    ],
  },
  hrly_elems: {
    contents: [
      ["Elements are specified by var major (vX) with an optional var minor (vN)."],
    ],
  },
  base: {
    heads: [],
    contents: [["Degree day base temperature in degrees F."]],
  },
  output: {
    heads: ["Code","Description"],
    contents: [
      ["json","JavaScript Object Notation (default)"],
      ["csv","Comma-Separated Values (unavailable for some requests, such as those including 'add', 'smry' or 'meta' and MultiStnData requests for a day range"],
    ],
  },
  grid_output: {
    heads: ["Code","Description"],
    contents: [
      ["json","JavaScript Object Notation (default)"],
      ["image","png image only"]
    ],
  },
  grid2_output: {
    heads: ["Code","Description"],
    contents: [
      ["json","JavaScript Object Notation (default)"],
      ["png","png image (display not implemented in this tool)"],
      ["geotiff","geotiff output (display not implemented in this tool)"],
    ],
  },
  date: {
    heads: ["Options","Example"],
    contents: [
      ["yyyy-mm-dd","2010-01-31"],
      ["yyyymmdd","20100131"],
      ["por (period of record)","por"],
    ],
    foots: "Can also use only yyyy or yyyymm when appropriate.",
  },
  reduce_add: {
    heads: ["Code", "Description"],
    contents: [ 
      ["mcnt", "Count of missing values in the reduction period"],
      ["date", "Date of occurrence (for max, min, run)"],
      ["value", "Value on date of occurrence (for first and last)"],
      ["rmcnt", "Count of missing values in the run period (for run only)"],
    ],
  },
  smry_add: {
    heads: ["Code", "Description"],
    contents: [ 
      ["mcnt", "Count of missing values in the reduction period"],
      ["date", "Date of occurrence (for max, min, run)"],
      ["value", "Value on date of occurrence (for first and last)"],
      ["rmcnt", "Count of missing values in the run period (for run only)"],
    ],
  },
  smry_only: {
    heads: ["Code", "Description"],
    contents: [ 
      ["1", "Return only the summary value (no intermediate results). If used, must be specified for each element."],
    ]
  },
  reduce_n: {
    heads: ["Value", "Description"],
    contents: [ 
      ["integer", "Used with run reduction to specify max number of results returned per interval."],
    ],
  },
  smry_n: {
    heads: ["Value", "Description"],
    contents: [ 
      ["integer", "Count of number of values to be returned. Maximum value is 100. Can only be used with smry reduce of 'max', 'min' or 'run'."],
    ],
  },
  reduce_run_maxmissing: {
    heads: ["Value", "Description"],
    contents: [ 
      ["integer", "Used with run reduction to specify max number of missing days to allow before terminating run."],
    ],
  },
  smry_run_maxmissing: {
    heads: ["Value", "Description"],
    contents: [ 
      ["integer", "Used with run reduction to specify max number of missing days to allow before terminating run."],
    ],
  },
  add: {
    heads: ["Code", "Description"],
    contents: [ 
      ["f", "Flags"],
      ["t", "Time of observation"],
      ["i", "Station ID associated with data"],
      ["v", "Var minor associated with data"],
      ["n", "Network associated with data"],
      ["s", "Source flag (for GHCN-Daily data)"],
    ],
    foots: "Enter one or more codes separated by commas."
  },
  normal: {
    heads: ["Code", "Description"],
    contents: [ 
      ["1", "Return default normals (1991-2020)"],
      ["departure", "Return default departure from normal (1991-2020)"],
      ["91", "Return 1991-2020 normals"],
      ["departure91", "Return departure from 1991-2020 normal"],
      ["81", "Return 1981-2010 normals"],
      ["departure81", "Return departure from 1981-2010 normal"],
    ],
    foots: "1991-2020 added as default effective 2021-05-04.",
  },
  interval: {
    heads: ["Code", "Description"],
    contents: [
      ["dly", "results consist of a daily value for each day; shortcut for [0,0,1]."],
      ["mly", "results consist of a monthly value for each calendar month; shortcut for [0,1]"],
      ["yly", "results consist of an annual value for each calendar year; shortcut for [1]"],
      ["array", "An array containing a single positive integer and zeros. The " + 
        "array can have a length of either 1, 2 or 3, with the length indicating the temporal " + 
  			"precision of the returned values. A length of 1 indicates annual precision, 2 monthly " + 
  			"precision and 3 daily precision. The position of non-zero integers within the array signifies " + 
  			"the frequency of the values returned. The strings dly, mly and yly are just shortcuts " + 
        "for commonly used intervals. " + 
        "Using an array facilitates a number of more complex requests. The " + 
        "following examples demonstrate some of these capabilities:"],
      ["subhead:Example", "subhead:Explanation"],
      ["[1,0,0]", "Return a daily value once per year. For instance, daily rainfall for June 20  in each of a series of years."],
      ["[0,1,0]", "Return a daily value once per month. For instance, max temperature on the 15th of each month for a series of years."],
      ["[0,0,7]", "Return a daily value every seven days."],
      ["[0,3,0]", "Return a daily value every third month."],
      ["[0,3]", "Return a monthly value every third month."],
      ["[30]", "Return an annual value every thirty years."],
    ],
    foots: "Note: 'interval' must be the same for all objects in an 'elems' array.",
  },
  duration: {
    heads: ["Code", "Description", "Valid with intervals or list representations"],
    contents: [
      ["integer", "Length of period to be analyzed in units specified by length of 'interval'", "dly, mly, yly, [x,x,x], [x,x], [x]"],
      ["mtd", "Month-to-date; must specify 'reduce'", "dly, [x,x,x]"],
      ["ytd", "Year-to-date; must specify 'reduce'", "dly, mly, [x,x,x], [x,x]"],
      ["std", "Season-to-date; must specify 'reduce' and 'season_start'", "dly, mly, [x,x,x], [x,x]"],
      ["dly", "Daily (NOT RECOMMENDED, use 1 instead)", "dly"],
      ["mly", "Monthly (NOT RECOMMENDED, use 1 instead)); must specify 'reduce'", "mly"],
      ["yly", "Yearly (NOT RECOMMENDED, use 1 instead); must specify 'reduce'", "yly"],
    ],
  },
  reduce: {
    heads: ["Code", "Description"],
    contents: [ 
      ["max", "Maximum value for the period"],
      ["min", "Minimum value for the period"],
      ["sum", "Sum of the values for the period"],
      ["mean", "Average of the values for the period"],
      ["list", "Array of daily values for the period"],
      ["cnt_xx_yyy", "Count of number of daily values passing threshold"],
      ["pct_xx_yyy", "Percent (integer) of daily values passing threshold"],
      ["fct_xx_yyy", "Fraction (float) of daily values passing threshold"],
      ["first_xx_yyy", "First occurrence of daily value passing threshold"],
      ["last_xx_yyy", "Last occurrence of daily value passing threshold"],
      ["run_xx_yyy", "Consecutive daily values passing threshold"],
      ["", "xx is operator (ge, gt, le, lt, eq, ne); yyy is threshold (integer or floating point); Examples: cnt_ge_0.01, pct_eq_100"],
    ],
  },
  grid_reduce: {
    heads: ["Code", "Description"],
    contents: [ 
      ["max", "Maximum value for the period"],
      ["min", "Minimum value for the period"],
      ["sum", "Sum of the values for the period"],
      ["mean", "Average of the values for the period"],
      ["stddev", "Standard deviation of the values"],
      ["list", "Array of daily values for the period"],
      ["cnt_xx_yyy", "Count of number of daily values passing threshold"],
      ["pct_xx_yyy", "Percent (integer) of daily values passing threshold"],
      ["fct_xx_yyy", "Fraction (float) of daily values passing threshold"],
     ["", "xx is operator (ge, gt, le, lt, eq, ne); yyy is threshold (integer or floating point); Examples: cnt_ge_0.01, pct_eq_100"],
    ],
  },
  grid2_reduce: {
    heads: ["Code", "Description"],
    contents: [ 
      ["max", "Maximum value for the period"],
      ["min", "Minimum value for the period"],
      ["sum", "Sum of the values for the period"],
      ["mean", "Average of the values for the period"],
      ["cnt_xx_yyy", "Count of number of daily values passing threshold"],
      ["", "xx is operator (ge, gt, le, lt, eq, ne); yyy is threshold (integer or floating point); Examples: cnt_ge_0.01, pct_eq_100"],
    ],
    foots: "Only certain cnt thresholds are available for LOCA pre-computed models (i.e. allmax, allmin, allmedian, wmean",
  },
  smry: {
    heads: ["Code", "Description"],
    contents: [ 
      ["max", "Maximum value for the column"],
      ["min", "Minimum value for the column"],
      ["sum", "Sum of values in the column"],
      ["mean", "Average of values in the column"],
      ["cnt_xx_yyy", "Count of number of values in column passing threshold"],
      ["pct_xx_yyy", "Percent (integer) of values in column passing threshold"],
      ["fct_xx_yyy", "Fraction (float) of values in columnn passing threshold"],
      ["run_xx_yyy", "Consecutive column values passing threshold"],
      ["", "xx is operator (ge, gt, le, lt, eq, ne); yyy is threshold (integer or floating point); Examples: cnt_ge_0.01, run_le_32"],
    ],
    foots: "More than one smry code can be specified by an array of strings or an array of objects.",
  },
  season_start: {
    heads: ["Description", "Examples"],
    contents: [ 
      ["For interval of dly or [x,x,x] - month and day", "[12,21] or 06-20"],
      ["For interval of mly or [x,x] - just month", "3"],
    ],
  },
  maxmissing: {
    heads: ["Description "],
    contents: [ 
      ["Integer value indicating the number missing daily values to allow before a reduction is reported as missing."],
    ],
  },
  prec: {
    heads: ["Description "],
    contents: [ 
      ["Integer value indicating the number of decimal places of precision displayed in the results for this element. Not available for some elements."],
    ],
  },
  groupby: {
    heads: ["Code", "Description"],
    contents: [
      ["year", "Results will be returned with all data for a year in a list."],
      ["year, mm-dd, mm-dd", "Results will be returned with all daily data between specified start date and end date in a list identified by ending year."],
      ["year, mm, mm", "Monthly summarized data will be returned for all months between specified start month and end month in a list identified by ending year."],
    ],
  },
  loc: {
    heads: ["Description","Example"],
    contents: [
	    ["Point location defined in decimal degrees (longitude, latitude); negative values for South latitude and West longitude","-77.7, 41.8"],
    ],
  },
  grid: {
    heads: ["ID","Description","Area","Period"],
    contents: [
      [" 1","NRCC Interpolated","Continental US","1950-present"],
      [" 2","Multi-Sensor Precipitation Estimates","Continental US","2006-present"],
      [" 3","NRCC Hi-Res","East of Rockies","Temp: 1998-present; Pcpn: 2002-present"],
      [" 21","PRISM (https://www.prism.oregonstate.edu)","Continental US","Daily: 1981-present; Monthly/Yearly: 1895-present"],
      [" 4-16","NARCCAP (to be deprecated) *","Continental US","1970-2000, 2040-2070"],
      ["4", "CRCM + NCEP (historical only)"],
      ["5", "CRCM + CCSM"],
      ["6", "CRCM + CGCM3"],
      ["9", "MM5I + NCEP (historical only)"],
      ["10", "MM5I + CCSM"],
      ["11", "RCM3 + NCEP (historical only)"],
      ["12", "RCM3 + CGCM3"],
      ["13", "RCM3 + GFDL"],
      ["14", "WRFG + NCEP (historical only)"],
      ["15", "WRFG + CCSM"],
      ["16", "WRFG + CGCM3"],
    ],
    foots: "* Be aware of idiosyncrasies before using NARCCAP grid sets.",
  },
  grid2: {
    heads: ["Name","Description","Area","Period"],
    contents: [
      ["nrcc-nn","NRCC Interpolated","Continental US","1950-present"],
      ["nrcc-model","NRCC Hi-Res","East of Rockies","Temp: 1998-present; Pcpn: 2002-present"],
      ["ncei-norm:91-20","NCEI Gridded Monthly 1991-2020 Normals","Continental US","1991"],
      ["prism","PRISM (https://www.prism.oregonstate.edu)","Continental US","Daily: 1981-present; Monthly/Yearly: 1895-present"],
      ["livneh","Livneh (https://www.esrl.noaa.gov/psd/","Continental US","1950-2012"],
      ["loca","LOCA downscaled data (http://loca.ucsd.edu/)","Continental US","1950-2099"],
      ["snap","SNAP (https://www.snap.uaf.edu)","Alaska","1970-2099"],
      [" "],
      ["subhead:Model-LOCA precomputed:","subhead:Description","",""],
      ["allmax", "Highest of 32 LOCA models (monthly only)","",""],
      ["allmin", "Lowest of 32 LOCA models (monthly only)","",""],
      ["allmedian", "Median of 32 LOCA models (monthly only)","",""],
      ["wmean", "Weighted mean of 32 LOCA models (monthly only)","",""],
      ["subhead:Model-LOCA individual:"],
      ["ACCESS1-0, ACCESS1-3, CCSM4, CESM1-BGC, CESM1-CAM5, CMCC-CM, CMCC-CMS, CNRM-CM5, CSIRO-Mk3-6-0, " +
       "CanESM2, EC-EARTH, FGOALS-g2, GFDL-CM3, GFDL-ESM2G, GFDL-ESM2M,, GISS-E2-H, GISS-E2-R, HadGEM2-AO, " +
       "HadGEM2-CC, HadGEM2-ES, IPSL-CM5A-LR, IPSL-CM5A-MR,, MIROC-ESM, MIROC-ESM-CHEM, MIROC5, MPI-ESM-LR, " +
       "MPI-ESM-MR, MRI-CGCM3, NorESM1-M, bcc-csm1-1, bcc-csm1-1-m, inmcm4"],
      ["subhead:Model-SNAP individual:"],
      ["GFDL-CM3, NCAR-CCSM4"],
      [" "],
      ["subhead:Scenarios","subhead:Description","subhead:Valid for",""],
      ["rcp85","High greenhouse gas and aerosol emissions scenario","loca and snap",""],
      ["rcp45","Medium greenhouse gas and aerosol emissions scenario","loca only",""],
    ],
    foots: "LOCA and SNAP datasets are specified in the form 'name:model:scenario', e.g. 'loca:wmean:rcp85'.",
  },
  units: {
    heads: ["Code","Description"],
    contents: [
      ["degreeC","Temperatures degrees C"],
      ["degreeF","Temperatures degrees F"],
      ["degreeK","Temperatures degrees K"],
      ["inch","Precipitation inches"],
      ["mm","Precipitation millimeters"],
    ],
  },
	area_reduce: {
		heads: ["Code","Description"],
		contents: [
			["aaaa_max","Maximum grid value in area"],
			["aaaa_min","Minimum grid value in area"],
			["aaaa_mean","Average of all grid values in the area"],
		],
		foots: "aaaa is area type ('county' ,'climdiv', 'basin', 'state'); Example: county_max",
	},	
	grid_meta: {
		heads: ["Code","Description"],
		contents: [
			["ll","Longitude and latitude of grid points (implementation pending in GridData2)"],
			["elev","Elevation of grid points (implementation pending in GridData2)"],
		],
  },
  grid_elems: {
		heads: ["Abbreviation","Var Major","Description"],
		contents: [
			["maxt","1","Maximum temperature (&deg;F)"],
			["mint","2","Minimum temperature (&deg;F)"],
			["avgt","43","Average temperature (&deg;F)"],
			["pcpn","4","Precipitation (inches)"],
			["cdd","","Cooling degree days (default base 65)"],
			["hdd","45","Degree days below base (default base 65)"],
			["gdd","44","Degree days above base (default base 50)"],
			["cddXX","-","Cooling Degree Days; where XX is base temperature"],
			["hddXX","-","Heating Degree Days; where XX is base temperature"],
			["gddXX","-","Growing Degree Days; where XX is base temperature"],
			["gddXX","-","Growing Degree Days; where XX is base temperature"],
			["subhead:Additional Element Codes for Monthly/Yearly PRISM Data"],
			["mly_maxt","91","Monthly mean maximum temperature (&deg;F)"],
			["mly_mint","92","Monthly mean minimum temperature (&deg;F)"],
			["mly_avgt","99","Monthly mean average temperature (&deg;F)"],
			["mly_pcpn","94","Monthly precipitation sum (inches)"],
			["yly_maxt","95","Yearly mean maximum temperature (&deg;F)"],
			["yly_mint","96","Yearly mean minimum temperature (&deg;F)"],
			["yly_avgt","100","Yearly mean average temperature (&deg;F)"],
			["yly_pcpn","98","Yearly precipitation sum (inches)"],
		],
    foots: "Degree days can also be specified with the keys 'name' (or 'vX') and 'base'. " +
            "The PRISM mly and yly codes are used to access monthly/yearly PRISM gridded datasets directly, not derived monthly/yearly values reduced from daily gridded data.",
  },
  grid2_name: {
		heads: ["Abbreviation","Var Major","Description"],
		contents: [
			["maxt","1","Maximum temperature (&deg;F)"],
			["mint","2","Minimum temperature (&deg;F)"],
			["avgt","43","Average temperature (&deg;F)"],
			["pcpn","4","Precipitation (inches)"],
			["cdd","","Cooling degree days (default base 65)"],
			["hdd","45","Degree days below base (default base 65)"],
			["gdd","44","Degree days above base (default base 50)"],
			["cddXX","-","Cooling Degree Days; where XX is base temperature"],
			["hddXX","-","Heating Degree Days; where XX is base temperature"],
			["gddXX","-","Growing Degree Days; where XX is base temperature"],
			["gddXX","-","Growing Degree Days; where XX is base temperature"],
		],
    foots: "Degree days can also be specified with the keys 'name' (or 'vX') and 'base'. ",
  },
  grid2_elems: {
		heads: [],
		contents: [
			["Elements must be specified as an object or list of objects."],
		],
	},
  info_only: {
    heads: ["Code","Description"],
    contents: [
      ["1","Only information about the map is returned, not png image"],
      ["", "If not specified, png image is returned in data portion of JSON object"],
    ],
  },
  proj: {
    heads: ["Code","Description"],
    contents: [
      ["lcc","Lambert conformal conic centered on selected area"],
    ],
    foots: "Default is Lambert conformal conic centered on the continental US.",
  },
  overlays: {
    heads: ["Code","Description"],
    contents: [
      ["state","State borders"],
      ["county","County borders"],
    ],
    foots: "Line width and color can also be specified, separated by colons. For example, ['state:1:red','county:1:blue']",
  },
  interp: {
    heads: ["Code","Description"],
    contents: [
      ["cspline","Cubic spline (default)"],
      ["none","No interpolation"],
    ],
  },
  cmap: {
    heads: ["Code","Description"],
    contents: [
      ["Blues","Shades of blue"],
      ["Reds","Shades of red"],
      ["jet","Blue to red"],
      ["...","Other color maps as defined in matplotlib: http://matplotlib.sourceforge.net/mpl_examples/pylab_examples/show_colormaps.pdf"],
    ],
  },
  width: {
    heads: ["Code","Description"],
    contents: [
      ["integer","Specify width of png image in pixels"],
    ],
    foots: "Only specify 'width' or 'height, not both.",
  },
  height: {
    heads: ["Code","Description"],
    contents: [
      ["integer","Specify height of png image in pixels"],
    ],
    foots: "Only specify 'height' or 'width, not both.",
  },
  levels: {
    heads: ["Description","Example"],
    contents: [
      ["Comma-separated list of contour levels","0,5,10,15,20"],
    ],
    foots: "Will be determined by server if not specified.",
  },
  general_id: {
    heads: ["Area","ID Type","Example"],
    contents: [
      ["state","Postal","NY"],
      ["county","FIPS","36109"],
      ["climdiv","Divison number","NY10"],
      ["cwa","NWS CWA","BGM"],
      ["basin","8-digit HUC","01080205"],
    ],
  },
  general_meta: {
    heads: ["Area","Available Meta Options"],
    contents: [
      ["state","id, name, bbox, geojson, state"],
      ["county","id, name, bbox, geojson, state"],
      ["climdiv","id, name, bbox, geojson, state"],
      ["cwa","id, name, bbox, geojson"],
      ["basin","id, name, bbox, geojson"],
    ],
    foots: "If not specified, default is id and name.",
  },
  network: {
		heads: ["Code","Network Name"],
		contents: [
      ["0","Unknown"],
      ["1","TD3200"],
      ["2","TD3210"],
      ["4","SHEF"],
      ["5","AWDN"],
      ["7","CF6"],
      ["8","RCC keyed"],
      ["9","NRCC local"],
      ["13","WRCC local"],
      ["14","SRCC local"],
      ["15","DSM"],
      ["16","TD3206"],
      ["17","GHCN-D"],
      ["19","CF6 overriding GHCN-D"],
      ["52","TD3205"],
      ["53","NWS Supplied"],
      ["54","ThreadEx"],
      ["56","CRB"],
		],
    foots: "Additional networks are available with only hourly data.",
  },
}

export default class HelpTable extends Component { 
  render() {
    let helpid = this.props.id
    if (helpid.includes('date')) {
      helpid = 'date'
    } else if (helpid === 'sid') {
      helpid = 'sids'
    } else if (helpid === 'name') {
      helpid = 'elems'
    }
    const helpdata = tabledata.hasOwnProperty(helpid) ? tabledata[helpid] : tabledata.nohelp
    const ncols = (helpdata.hasOwnProperty("contents")) ? helpdata.contents[0].length : 1
    return (
      <Paper elevation={1} style={{border:"1px solid gray", margin:"1em 10%", padding:"5px", backgroundColor:"lightcyan"}}>
        <Table padding="dense">
          {helpdata.hasOwnProperty("heads") && helpdata.heads.length > 0 &&
            <TableHead>
              <TableRow style={{height:"1em"}}>
                {helpdata.heads.map((cell, i) => (
                  <TableCell key={i}>{cell}</TableCell>
                ))}
              </TableRow>
            </TableHead>
          }
          {helpdata.hasOwnProperty("contents") && helpdata.contents.length > 0 &&
            <TableBody>
            {helpdata.contents.map((row, i) => (
              <TableRow hover={true} key={i} style={{height:"1em"}}>
                {row.map((cell, j) => (
                  <TableCell variant={cell.includes("subhead:") ? "head" : "body"} colSpan={row.length === 1 ? ncols : 1} key={j}>{cell.replace("subhead:","")}</TableCell>
                ))}
              </TableRow>
            ))}
            </TableBody>
          }
          {helpdata.hasOwnProperty('foots') && helpdata.foots.length > 0 && 
            <TableFooter>
              <TableRow style={{height:"1em"}}>
                <TableCell colSpan={ncols}>{helpdata.foots}</TableCell>
              </TableRow>
            </TableFooter>
          }
        </Table>
      </Paper>
    )
  }
}