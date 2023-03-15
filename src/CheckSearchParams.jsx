import { useEffect} from 'react'
import { useSearchParams } from 'react-router-dom'

const CheckSearchParams = (props) => {
    const [ searchParams ] = useSearchParams()

    // eliminate need to require CamelCase service specification in search string
    const services = {
        "stnmeta": "StnMeta",
        "stndata": "StnData",
        "multistndata": "MultiStnData",
        "griddata": "GridData",
        "griddata2": "GridData2",
        "stnhourly": "StnHourly",
        "general": "General",
    }

    const handleSearchChange = (srchstr) => {
        if (srchstr.has("service") && srchstr.has("params")) {
            const service = srchstr.get("service").toLowerCase()
            if (services.hasOwnProperty(service)) {
                const wstype = services[service]
                const params_string = decodeURIComponent(srchstr.get("params"))
                const generalArea = (wstype === "General" && srchstr.has("area")) ? srchstr.get("area") : ""
                props.setWstype(wstype)
                props.setGeneralArea(generalArea)
                props.setInput_params_string(params_string)
                try {
                    const input_params = JSON.parse(params_string)
                    props.setInput_params(input_params)
                    props.setResetElemsBuilder(true)
                } catch {
                    console.log('Invalid JSON in url')
                }
            }
        }
     }

    useEffect(() => {
      handleSearchChange(searchParams)
      // eslint-disable-next-line
    }, [searchParams])
}

export default CheckSearchParams