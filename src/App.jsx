import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import QuerySelector from './QuerySelector.jsx'
import StnMetaInput from './StnMetaInput.jsx'
import StnDataInput from './StnDataInput.jsx'
import MultiStnDataInput from './MultiStnDataInput.jsx'
import StnHourlyInput from './StnHourlyInput.jsx'
import GridDataInput from './GridDataInput.jsx'
import GridData2Input from './GridData2Input.jsx'
import GeneralInput from './GeneralInput.jsx'
import Output from './Output'
import HelpTable from './HelpTable'
import DrawerContent from './DrawerContent.jsx'
import CheckSearchParams from './CheckSearchParams'

const App = () => {
  const [ wstype, setWstype ] = useState('StnData')
  const [ server, setServer ] = useState('Any')
  const [ input_params, setInput_params ] = useState({})
  const [ input_params_string, setInput_params_string ] = useState('')
  const [ generalArea, setGeneralArea ] = useState('')
  const [ resetElemsBuilder, setResetElemsBuilder ] = useState(false)
  const [ helpFor, setHelpFor ] = useState()
  const [ drawerStatus, setDrawerStatus ] = useState(false)
  
  const handleQueryChange = (value) => {
    setWstype(value)
    setInput_params({})
    setGeneralArea('')
    setHelpFor('')
  }

  const updateInputParams = (changes) => {
    let new_input_params = input_params
    Object.keys(changes).forEach((key) => {
      const value = changes[key]
      if (value || (typeof value === 'object' && Object.keys(value).length > 0)) {
        new_input_params[key] = value
      } else {
        delete new_input_params[key]
      }
    })
    setInput_params({ ...new_input_params })
  }

  return (
    <div>
       <QuerySelector
        wstype={wstype}
        handleChange={handleQueryChange}
        toggleDrawer={setDrawerStatus}
      />
      {wstype === "StnMeta" && 
        <StnMetaInput 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
        />
      }
      {wstype === "StnData" && 
        <StnDataInput 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
          resetElemsBuilder={resetElemsBuilder}
          setResetElemsBuilder={setResetElemsBuilder}
        />
      }
      {wstype === "MultiStnData" && 
        <MultiStnDataInput 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
          resetElemsBuilder={resetElemsBuilder}
          setResetElemsBuilder={setResetElemsBuilder}
        />
      }
      {wstype === "StnHourly" && 
        <StnHourlyInput 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
          resetElemsBuilder={resetElemsBuilder}
          setResetElemsBuilder={setResetElemsBuilder}
        />
      }
      {wstype === "GridData" && 
        <GridDataInput 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
          resetElemsBuilder={resetElemsBuilder}
          setResetElemsBuilder={setResetElemsBuilder}
        />
      }
      {wstype === "GridData2" && 
        <GridData2Input 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
          resetElemsBuilder={resetElemsBuilder}
          setResetElemsBuilder={setResetElemsBuilder}
        />
      }
      {wstype === "General" && 
        <GeneralInput 
          updateInputParams={updateInputParams}
          updateHelpFor={setHelpFor}
          input_params={input_params}
          generalArea={generalArea}
          updateGeneralArea={setGeneralArea}
        />
      }
      {helpFor && 
        <HelpTable 
          id={helpFor}
        /> 
      }
      <Output
        input_params={input_params} 
        setInput_params={setInput_params}
        wstype={wstype}
        server={server}
        generalArea={generalArea}
        input_params_string={input_params_string}
        setInput_params_string={setInput_params_string}

      />
      <DrawerContent 
        server={server}
        updateServer={setServer}
        drawerStatus={drawerStatus}
        toggleDrawer={setDrawerStatus}
        setWstype={setWstype}
        setInput_params_string={setInput_params_string}
        setInput_params={setInput_params}
        setGeneralArea={setGeneralArea}
        setResetElemsBuilder={setResetElemsBuilder}
      />
       <BrowserRouter>
        <CheckSearchParams 
          setWstype={setWstype}
          setInput_params_string={setInput_params_string}
          setInput_params={setInput_params}
          setGeneralArea={setGeneralArea}
          setResetElemsBuilder={setResetElemsBuilder}
        />
      </BrowserRouter>
    </div>
  )
}

export default App
