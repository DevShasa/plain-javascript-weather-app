import { getWeather } from './weather'
import { ICON_MAP } from './IconMap'


getWeather(-0.270320, 36.377838, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch((e)=>{
    console.log(e)
    alert("Error getting weather")
})

function renderWeather({current, daily, hourly}){
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
    document.body.classList.remove("blurred")
}

// sets valyue given a data atribute
function setValue(selector, value,  {parent=document}={}){
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode){
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current){
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-fl-high", current.highFeelsLike)
    setValue("current-wind", current.windSpeed)
    setValue("current-low", current.lowTemp)
    setValue("current-fl-low", current.lowFeelsLike)
    setValue("current-precip", current.precip)
}

const DAY_FORMATER = new Intl.DateTimeFormat(undefined, {weekday:"long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily){
    dailySection.innerHTML = "" // nuke all the that exist inside day section
    daily.forEach(day=>{
        const dayWeatherDisplayElement = dayCardTemplate.content.cloneNode(true)
        dayWeatherDisplayElement.querySelector("[data-icon]").src=getIconUrl(day.iconCode)
        // multiply by 1000 to convert uts into miliseconds whuich plays nice with datetimeformat
        setValue("date", DAY_FORMATER.format(day.timeStamp * 1000), {parent:dayWeatherDisplayElement})
        setValue("temp", day.maxTemp, {parent:dayWeatherDisplayElement})
        dailySection.append(dayWeatherDisplayElement)
    })
}

const HOUR_FORMATER = new Intl.DateTimeFormat(undefined, {hour: "numeric"})
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly){
    hourlySection.innerHTML = ""
    hourly.forEach(hour=>{
        const hourRowDataElement = hourRowTemplate.content.cloneNode(true)
        setValue("day", DAY_FORMATER.format(hour.timeStamp * 1000), {parent:hourRowDataElement})
        setValue("time", HOUR_FORMATER.format(hour.timeStamp * 1000), {parent:hourRowDataElement})
        hourRowDataElement.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        setValue("temp", hour.temp, {parent:hourRowDataElement})
        setValue("fl-temp", hour.feelsLike, {parent:hourRowDataElement})
        setValue("wind", hour.windSpeed, {parent:hourRowDataElement})
        setValue("precip", hour.precip, {parent:hourRowDataElement})
        hourlySection.append(hourRowDataElement)
    })
}