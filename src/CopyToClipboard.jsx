import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Snackbar from '@mui/material/Snackbar'

const CopyToClipboard = (props) => {
    const [ open, setOpen ] = useState(false)

    const handleClick = () => {
      setOpen(true)
      navigator.clipboard.writeText(props.cliptext)
    }
    
    return (
        <>
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={handleClick} size="small" sx={{pr:0}}>
              <ContentCopy fontSize="small" sx={{color:props.color}} />
            </IconButton>
          </Tooltip>

          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
        </>
    )
}

export default CopyToClipboard