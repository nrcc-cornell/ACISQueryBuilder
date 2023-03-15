import React from 'react'
import Chip from '@mui/material/Chip'
import RenderTextField from './RenderTextField'

const DateSelection = (props) => { 
  const { updateParam, updateHelpFor, date, sdate, edate, datetype, setDatetype } = props

  const handleChipClick = () => {
    if (datetype === 'pair') {
      updateParam({
        sdate:"", 
        edate:"", 
        date:sdate
      })
      setDatetype("single")
    } else {
      updateParam({
        date: "", 
        sdate:date
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
          value={sdate}
          updateHelpFor={updateHelpFor}
          updateParam={updateParam}
          />
          <RenderTextField
          id="edate"
          fieldlabel="End date"
          value={edate}
          updateHelpFor={updateHelpFor}
          updateParam={updateParam}
          />
        </div>
      }
      {datetype === 'single' &&
        <RenderTextField
            id="date"
            fieldlabel="Date"
            value={date}
            updateHelpFor={updateHelpFor}
            updateParam={updateParam}
        />
      }
    </div>
  )
}

export default DateSelection