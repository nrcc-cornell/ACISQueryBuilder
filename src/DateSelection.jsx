import React, { useState } from 'react'
import Chip from '@mui/material/Chip'
import RenderTextField from './RenderTextField'

const DateSelection = (props) => { 
  const [ datetype, setDatetype ] = useState('pair')

  const handleChipClick = () => {
    if (datetype === 'pair') {
      props.updateParam({
        sdate:"", 
        edate:"", 
        date:props.sdate
      })
      setDatetype("single")
    } else {
      props.updateParam({
        date: "", 
        sdate:props.date
      })
      setDatetype("pair")
    }
  }

  return (
    <div>
      <Chip
        label={datetype === 'pair' ? "Change to single date" : "Change to start/end dates"}
        clickable={true}
        variant="outlined"
        onClick={handleChipClick}
      />
      {datetype === 'pair' &&
        <div>
          <RenderTextField
          id="sdate"
          fieldlabel="Start date"
          value={props.sdate}
          updateHelpFor={props.updateHelpFor}
          updateParam={props.updateParam}
          />
          <RenderTextField
          id="edate"
          fieldlabel="End date"
          value={props.edate}
          updateHelpFor={props.updateHelpFor}
          updateParam={props.updateParam}
          />
        </div>
      }
      {datetype === 'single' &&
        <RenderTextField
            id="date"
            fieldlabel="Date"
            value={props.date}
            updateHelpFor={props.updateHelpFor}
            updateParam={props.updateParam}
        />
      }
    </div>
  )
}

export default DateSelection