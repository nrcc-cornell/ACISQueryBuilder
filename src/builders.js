export function buildElement(elementKeys, elementValues, action="add") {
  let elem = {}
  let subelems = []
  const mustBeNumber = ['duration','vX','vN','prec','base']
  elementKeys.forEach((item) => {
    if (elementValues[item] !== '') {
      if (mustBeNumber.includes(item) && !isNaN(Number(elementValues[item]))) {
        elem[item] = Number(elementValues[item])
      } else {
        elem[item] = elementValues[item]
      }
    }
  })
  // if interval is a list, make it an array (not a string)
  if (elem.hasOwnProperty('interval') && (elem.interval.includes(",") || elem.interval.includes("["))) {
    elem.interval = elem.interval.replace(/[[\]]/g,"").split(",").map((item) => {return Number(item)})
  }
  // figure out whether or not selection is for single day
  const notdly = (typeof elem.duration === "string" && elem.duration !== 'dly') || 
    (typeof elem.duration === 'number' && (elem.duration !== 1 || (elem.interval !== 'dly' && !(Array.isArray(elem.interval) && elem.interval.length === 3))))
  // can only have add for dly/dly; can only have reduce and max_missing if not dly/dly
  if (notdly) {
    delete elem.add
  } else {
    //delete elem.reduce - commented out 14-Feb-2023 -kle
    delete elem.maxmissing
  }
  // can only have groupby if interval is not yly
  if (elem.hasOwnProperty('interval') && (elem.interval === 'yly' || (Array.isArray(elem.interval) && elem.interval.length === 1))) {
    delete elem.groupby
  }
  // can only have base for degree days
  if (elem.hasOwnProperty('name') && !elem.name.includes("dd")) {
    delete elem.base
  }
  // can only have season_start for std
  if (elem.hasOwnProperty('duration') && elem.duration !== 'std') {
    delete elem.season_start
  }
  // if season_start is a list, make it an array (not a string)
  if (elem.hasOwnProperty('season_start') && (elem.season_start.includes(",") || elem.season_start.includes("["))) {
    elem.season_start = elem.season_start.replace(/[[\]]/g,"").split(",").map((item) => {return Number(item)})
  }
  // convert name of element sdate and edate
  if (elem.hasOwnProperty('elem_sdate')) {
    elem.sdate = elem.elem_sdate
    delete elem.elem_sdate
  }
  if (elem.hasOwnProperty('elem_edate')) {
    elem.edate = elem.elem_edate
    delete elem.elem_edate
  }
  // build reduce object, if necessary
  subelems = elementKeys.filter(item => item.includes('reduce_'))
  if (elem.hasOwnProperty('reduce')) {
    // can only have reduce_run_maxmissing if reduce is 'run'
    if (!elem.reduce.includes('run')) {
      delete elem.reduce_run_maxmissing
    }
    let newObject = {}
    subelems.forEach((item) => { 
      if (elem.hasOwnProperty(item)) {
        newObject[item.replace('reduce_','')] = elem[item]
        delete elem[item]
      }
    })
    if (Object.keys(newObject).length > 0) {
      elem.reduce = {...newObject, reduce:elem.reduce}
    }
  } else {
    subelems.forEach((item) => { 
      if (elem.hasOwnProperty(item)) {
          delete elem[item]
      }
    })
  }
  // build smry object, if necessary
  subelems = elementKeys.filter(item => item.includes('smry_') && item !== 'smry_only')
  if (elem.hasOwnProperty('smry')) {
    // can only have smry_run_maxmissing if smry is 'run'
    if (!elem.smry.includes('run')) {
      delete elem.smry_run_maxmissing
    }
    let newObject = {}
    subelems.forEach((item) => { 
      if (elem.hasOwnProperty(item)) {
        newObject[item.replace('smry_','')] = elem[item]
        delete elem[item]
      }
    })
    if (Object.keys(newObject).length > 0) {
      elem.smry = {...newObject, reduce:elem.smry}
    }
  } else {
    subelems.forEach((item) => { 
      if (elem.hasOwnProperty(item)) {
        delete elem[item]
      }
    })
    delete elem.smry_only
  }
  return elementValues.elems.includes("{") && action !== "replace"  ? [...JSON.parse(elementValues.elems), elem] : [elem]
}

export function buildImage(imageKeys, imageValues) {
  let image = {}
  imageKeys.forEach((item) => {
    if (imageValues[item] !== '') {
      // width and height must be an integer (not a string)
      image[item] = (item === 'width' || item === 'height') ? Number(imageValues[item]) : imageValues[item]
    }
  })
  // levels must be an array (not a string)
  if (image.hasOwnProperty('levels')) {
    image.levels = image.levels.replace(/[[\]]/g,'').split(",").map((item) => {return Number(item)})
  }
  // overlays must be an array if more than one are specified
  if (image.hasOwnProperty('overlays') && image.overlays.includes(",")) {
    image.overlays = image.overlays.replace(/[[\]]/g,'').split(",").map((item) => {return item.replace(/["']/g,'')})
  }
  return image
}

export function buildExplanation(params) {
  let explanation = ""
  let elems = null
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const formatDate = (date, rlen) => {
    let ymd = []
    if (date.includes("-")) {
      ymd = date.split("-").map(item => {return Number(item)})
    } else if ((rlen === "day" && date.length === 8) || (rlen === "month" && date.length === 6) || (rlen === "year" && date.length === 4)) {
      ymd = [Number(date.substr(0,4)), Number(date.substr(4,2)), Number(date.substr(6,2))]
    } else if (date === 'por') {
      return 'period of record'
    } else {
      return null
    }
    if (rlen === "year") {
      return ymd[0]
    } else if (rlen === "month") {
      return monthName[ymd[1]-1] + " " + ymd[0]
    } else if (rlen === "day") {
      return monthName[ymd[1]-1] + " " + ymd[2] + ", " + ymd[0]
    }
    return null
  }
  const badintervalMessage = "Not a valid interval. Clear this element and add again with a valid interval."
  const baddurationlMessage = "Not a valid duration. Clear this element and add again with a valid duration."
  const noreduceMessage = "You need to specify a reduction for this request. Clear this element and add again with a reduction."
  const noseasonstartMessage = "You need to specify a 'season start' for a duration of 'std'. Clear this element and add again with a season start."
  const baddateMessage = "Invalid date specifications."
   const durationText = {mtd:"month-to-date", std:"season-to-date", ytd:"year-to-date"}
  const ymd = ['year','month','day']
  if (!params.hasOwnProperty('elems')) {
    return null
  }
  //process last element
  try {
    elems = typeof params.elems === "string" ? JSON.parse(params.elems).slice(-1)[0]: params.elems.slice(-1)[0]
  } catch {
    return null
  }
  // interpret the interval portion of the request
  if (!elems.hasOwnProperty('interval')) {
    return null
  }
  let interval = elems.interval
  if (typeof interval === 'string') {
    if (interval === 'dly') {
      interval = [0,0,1]
    } else if (interval === 'mly') {
      interval = [0,1]
    } else if (interval === 'yly') {
      interval = [1]
    } else {
      return badintervalMessage
    }
  }
  const intcnt = Math.max(...interval)
  const intpos = interval.indexOf(intcnt)
  if (interval.length < 1 || interval.length > 3 || intpos < 0) {
    return badintervalMessage
  }
  const intfreq = ymd[interval.length-1]
  const inttype = ymd[intpos]
  
  // preocess duration/reduce portion
  let duration = elems.hasOwnProperty('duration') ? elems.duration : 1
  const reduce = elems.hasOwnProperty('reduce') ? (typeof elems.reduce === 'object' ? elems.reduce.reduce : elems.reduce) : null
  if (duration === 'dly' || duration === 'mly' || duration === 'yly') {
    duration = 1
  } else if (!isNaN(Number(duration))) {
    duration = Number(duration)
  }
  if ((duration !== 1 || intfreq !== 'day') && !reduce) {
    return noreduceMessage
  } else if (typeof duration === 'string' && !durationText.hasOwnProperty(duration)) {
    return baddurationlMessage
  } else if (duration === 'std' && !elems.hasOwnProperty("season_start")) {
    return noseasonstartMessage
  } else if (duration !== 1 || intfreq !== 'day') {
    const durphrase = typeof duration === 'string' ? durationText[duration] : (duration + "-" + intfreq)
    explanation += "Each data value returned for this query element will be a " + durphrase + " " + reduce
    // include season_start when appropriate
    if (duration === 'std') {
      if (typeof elems.season_start === "string") {
        elems.season_start = elems.season_start.split("-").map(item => { return Number(item) })
      }
      if (elems.season_start.length === 1) {
        elems.season_start.push(1)
      }
      const season_start = monthName[elems.season_start[0]-1] + " " + elems.season_start[1]
      explanation += " since " + season_start
    }
    explanation += ". "
  }
  const intphrase = intcnt === 1 ? inttype : (intcnt + " " + inttype + "s")
  explanation += "Results will consist of one value every " + intphrase
  // date portion
  if ((params.hasOwnProperty('sdate') && params.hasOwnProperty('edate')) || 
      params.hasOwnProperty('date') ||
      (elems.hasOwnProperty('sdate') && elems.hasOwnProperty('edate'))) {
    const sdate = elems.sdate || params.sdate || params.date
    const edate = elems.edate || params.edate || null
    let sdatestr = formatDate(sdate, intfreq)
    let edatestr = edate ? formatDate(edate, intfreq) : 'na'
    if (!sdatestr || !edatestr) {
      return baddateMessage
    }
    if (intfreq === 'day' && intpos < 2) {
      const sdparts = sdatestr.split(", ")
      const edparts = edatestr.split(", ")
      edatestr = sdparts[0] + ", " + edparts[1]
    } else if (intfreq === 'month' && intpos < 1) {
      const sdparts = sdatestr.split(" ")
      const edparts = edatestr.split(" ")
      edatestr = sdparts[0] + " " + edparts[1]
    }
    const datephrase = elems.hasOwnProperty('reduce') ? "the periods ending " : ""
    explanation += " for " + datephrase + sdatestr + (edatestr !== 'na' ? " through " + edatestr : "")
  }
  explanation += ". " 
    
  return explanation
}

export function checkHasInterval(update) {
  if (update.elems.length > 0) {
    try {
      let updateElems = JSON.parse(update.elems)
      let cond = false
      updateElems.forEach((ue) => {
        if (ue.hasOwnProperty('interval') && ue.interval.length) {
          cond = true
        }
      })
      return cond
    } catch {
      console.log('Error parsing elems update: ' + update.elems)
      return false
    }
  } else {
    return false
  }
}

export const checkElemsError = (strelems) => {
  try {
    if (strelems.includes("{")) {
      // check for valid json
      JSON.parse(strelems)
    }
    return false
  } catch {
    return true
  }    
}

export function basicFormat(results_json) {
  let results_string = ""
  let dataimage = ""
  Object.keys(results_json).forEach(key => {
    if (key === 'data' && results_json[key].includes("image/png;base64")) {
      dataimage = results_json[key]
    } else if (Array.isArray(results_json[key])) {
      results_string += key + ":\n"
      results_json[key].forEach(item => {
        results_string += " " + JSON.stringify(item) + "\n"
      }) 
    } else {
      results_string += key + ":\n"
      results_string += " " + JSON.stringify(results_json[key]) + "\n"
    }
  })
  return {results_string: results_string, dataimage: dataimage}
}