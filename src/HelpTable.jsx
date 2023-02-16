import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import tabledata from './helpTableData.json'

const HelpTable = (props) => { 
  let helpid = props.id
  if (!helpid) { 
    return 
  } else if (helpid.includes('date')) {
    helpid = 'date'
  } else if (helpid === 'sid') {
    helpid = 'sids'
  } else if (helpid === 'name') {
    helpid = 'elems'
  }

  const helpdata = tabledata.hasOwnProperty(helpid) ? tabledata[helpid] : tabledata.nohelp
  const ncols = helpdata.hasOwnProperty("contents") ? helpdata.contents[0].length : 1
  
  return (
    <Paper elevation={1} variant="helpPaper">
      <Table size="small">
        {helpdata.hasOwnProperty("heads") && helpdata.heads.length > 0 &&
          <TableHead>
            <TableRow>
              {helpdata.heads.map((cell, i) => (
                <TableCell key={i}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        }
        {helpdata.hasOwnProperty("contents") && helpdata.contents.length > 0 &&
          <TableBody>
            {helpdata.contents.map((row, i) => (
              <TableRow hover={true} key={i}>
                {row.map((cell, j) => (
                  <TableCell variant={cell.includes("subhead:") ? "head" : "body"} colSpan={row.length === 1 ? ncols : 1} key={j}>
                    {cell.replace("subhead:","")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        }
        {helpdata.hasOwnProperty('foots') && helpdata.foots.length > 0 && 
          <TableFooter>
            <TableRow>
              <TableCell colSpan={ncols}>
                {helpdata.foots}
              </TableCell>
            </TableRow>
          </TableFooter>
        }
      </Table>
    </Paper>
  )
}

export default HelpTable