import axios from "axios";

// https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime

export function getWeather(lat, long, timezone){
    return axios
        .get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime", {params:{
            latitude: lat,
            longitude: long,
            timezone,
        }})
        .then(({data})=>{
            return {
                current: parseCurrentWeather(data),
                daily: parseDailyWeather(data),
                hourly: parseHourlyWeather(data),
            }
        })
}

function parseCurrentWeather({current_weather, daily}){
    const { temperature, windspeed, weathercode } = current_weather

    const { 
        // basicaly reasigning names from left as it appears in api to right as we want it to appear
        temperature_2m_max: [maxTemp, maxTemp1, maxTemp2, maxTemp3], // you get the drift, naming individual array items
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
    } = daily

    return{
        currentTemp: Math.round(temperature),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windspeed),
        precip: Math.round(precip * 100)/ 100, // rounding to the nearest 100
        iconCode: weathercode
    }
}

function parseDailyWeather({daily}){
    return daily.time.map((time, index)=>{
        return{
            timeStamp: time,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index])
        }
    })
}

function parseHourlyWeather({hourly, current_weather}){
    return hourly.time.map((time, index)=>{
        return{
            precip: Math.round(hourly.precipitation[index]* 100)/ 100,
            timeStamp: time,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            windSpeed:Math.round(hourly.windspeed_10m[index]),
        }
    }).filter(({timeStamp}) => timeStamp >= current_weather.time)
}