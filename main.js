import './style.css'
import { getWeather } from './weather'

getWeather(52.52, 13.41, Intl.DateTimeFormat().resolvedOptions().timeZone).then(data=>console.log(data))