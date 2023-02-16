import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import ResultsButtons from './ResultsButtons'
import CopyToClipboard from './CopyToClipboard'
import { basicFormat } from './builders'
import { acisServers } from './acisServers'

const Output = (props) => {
  const [ datastate, setDatastate ] = useState({
    results: "",
    results_json: {},
    //format: "normal", hard code all whitespace options to pre-wrap, instead of some being "normal"
    dataimage: "",
  })
  const [ input_params_string, setInput_params_string ] = useState("")
  const [ hasParamsError, setHasParamsError ] = useState(false)
  const [ selectedButton, setSelectedButton ] = useState("JSON")
  const [ isCsv, setIsCsv ] = useState(false)

  const getAcisServerUrl = () => {
    let serverurl = acisServers[props.wstype]
    const rccindex = serverurl.indexOf('data.rcc-acis')
    if (rccindex !== -1 && props.server !== 'Any') {
      serverurl = `${serverurl.slice(0,rccindex+4)}.${props.server.toLowerCase()}${serverurl.slice(rccindex+4)}`
    }
    return serverurl + props.generalArea
  }

  // user changed parameter string
  const handleParamsChange = event => {
    const inputString = event.target.value
    setInput_params_string(inputString)
    setDatastate({...datastate, ...{results: ''}})
    if (inputString.length > 0) {
      try {
        const parsedString = JSON.parse(inputString)
        props.setInput_params(parsedString)
        setHasParamsError(false)
      } catch {
        setHasParamsError(true)
      }
    }
  }  

  // submit parameter string to server
  const handleSubmit = () => {
    setDatastate({...datastate, ...{
      results: "Submitting request ..."
    }})
    const url = getAcisServerUrl()
    if (props.input_params.output !== "image") {
      fetch(url, {
        method: 'POST',
        body: input_params_string,
        headers: {'Content-Type': 'application/json'}
      })
        .then(response => response.ok && !isCsv ? response.json() : response.text())
        .then(data => {
          setDatastate({...datastate, ...{
            results: typeof data === 'object' ? JSON.stringify(data,null,0) : data,
            results_json: data,
            //format: typeof data === 'string' ? "pre-wrap" : "normal",
            dataimage: "",
          }})
          setSelectedButton(typeof data === 'object' ? "JSON" : "")
        })
        .catch(error => setDatastate({...datastate, ...{
          results: 'Error: ' + error.message,
          dataimage: ""
        }}))
    } else {
      setDatastate({...datastate, ...{
        results: "image",
        results_json: '',
        //format: 'normal',
        dataimage: url + '?params=' + input_params_string
      }})
      setSelectedButton("")
    }
  }

  // user clicked one of the format buttons
  const handleFormat = (results_button) => {
    setSelectedButton(results_button)
    if (results_button === "JSON") {
      setDatastate({...datastate, ...{
        results: JSON.stringify(datastate.results_json,null,0), 
        //format:"normal", 
        dataimage: "",
      }})
    } else if (results_button === "Basic format") {
      const basicFormatResults = basicFormat(datastate.results_json)
      setDatastate({...datastate, ...{
        results: basicFormatResults.results_string,
        //format:"pre-wrap", 
        dataimage: basicFormatResults.dataimage.length > 0 ? basicFormatResults.dataimage : '',
      }})
    } else if (results_button === "Full format") {
      const hasImage = datastate.results_json.hasOwnProperty("data") && datastate.results_json.data.includes("image/png;base64")
      setDatastate({...datastate, ...{
        results: JSON.stringify(datastate.results_json,null,2), 
        //format: "pre-wrap", 
        dataimage: hasImage ? datastate.results_json.data : ''
      }})
    } else {
      console.log('Error: unknown format button')
    }
  }

  // JSON parameters object needs to be stringified for display in text box
  useEffect(() => {
    //if (Object.keys(props.input_params).length === 0) {
      setDatastate({...datastate, ...{results:''}})
    //}
    let newparams = props.input_params
    if (props.input_params.hasOwnProperty("elems") && props.input_params.elems.includes("{")) {
      const parsed_elems = JSON.parse(props.input_params.elems)
      newparams = ({...newparams, ...{elems: parsed_elems}})
    }
    // empty bbox has to be converted from string to empty array in parameters string
    if (props.input_params.hasOwnProperty('bbox') && props.input_params.bbox === "[]") {
      newparams = ({...newparams, ...{bbox: []}})
    }
    setInput_params_string(JSON.stringify(newparams))
    setIsCsv(props.input_params.output === 'csv')
    setHasParamsError(false)
    // eslint-disable-next-line
  }, [props.input_params])

  // update url of server whenever the wstype or specific server selections change
  useEffect(() => {
    setDatastate({...datastate, ...{
      results: "",
      results_json: {},
      dataimage: "",
    }})
    // eslint-disable-next-line
}, [props.wstype, props.server])

  return (
    <Box sx={{mt:"1em"}}>
      <Typography variant="h6">
        Parameters (JSON)
        {input_params_string.length > 2 &&
          <Button 
            size="small"
            variant="go"
            onMouseDown={handleSubmit}
          >
            Submit
          </Button>
        }
      </Typography>
      <TextField
        id="params"
        value={input_params_string}
        margin="dense"
        variant="outlined"
        error={hasParamsError}
        helperText={hasParamsError ? "Error in Parameters encoding" : ""}
        multiline={true}
        fullWidth={true}
        inputProps={{sx:{fontSize:"90%",p:0}}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CopyToClipboard cliptext={input_params_string} color="blue" />
            </InputAdornment>
          )
        }}
        onChange={handleParamsChange}
      />
      
      {datastate.results.length > 0 && 
        <div>
          {datastate.results !== "image" &&
            <ResultsButtons
              handleFormat={handleFormat}
              showButtons={!isCsv}
              selectedButton={selectedButton}
            />
          }
          <Paper variant="resultsPaper">
            {datastate.dataimage.length > 0 &&
              <div>
                <Typography component="pre" variant="pre">
                  {datastate.dataimage.includes("http") ? "Returned image" : "data (as image)"}
                </Typography>
                <img src={datastate.dataimage} alt="map" />
              </div>
            }
            {!datastate.dataimage.includes("http") &&
              <Typography component="pre" variant="pre">
                {datastate.results}
              </Typography>
            }
          </Paper>
        </div>
      }
    </Box>
  )
}

export default Output  

/* old format pre results style (wordBreak:"normal",overflowWrap:"anywhere",whiteSpace:datastate.format} */