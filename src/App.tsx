import { useEffect, useState } from 'react'
import './App.css'
import Indicator from './components/Indicator';
import Grid from '@mui/material/Unstable_Grid2';
import BasicTable from './components/BasicTable';

function App() {
  const [indicators, setIndicators] = useState([]);

  useEffect( ()=>{ 
    (async ()=>{
      let savedTextXML = localStorage.getItem("openWeatherMap");
      let expiringTime = localStorage.getItem("expiringTime");

      let nowTime = new Date().getTime();

      if(expiringTime === null || nowTime > parseInt(expiringTime)){
        let API_KEY = "e3445adc27a6e30de8b74a5ad819d7fb"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=Guayaquil&mode=xml&appid=${API_KEY}`)
        savedTextXML = await response.text();

        let hours = 1;
        let delay = hours * 3600000

        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", (nowTime + delay).toString())
      }

      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let dataToIndicators = new Array()

      let location = xml.getElementsByTagName("city")[0];
      let name = location.getAttribute("name");

      dataToIndicators.push(["Lugar", name]);

      let temperature = xml.getElementsByTagName("temperature")[0];
      let temperatureValue = temperature.getAttribute("value");

      dataToIndicators.push(["Temperatura", temperatureValue += "°C"]);

      let wind = xml.getElementsByTagName("speed")[0];
      let speedValue = wind.getAttribute("value");

      dataToIndicators.push(["Velocidad del Viento", speedValue += "m/s"]);

      let humidity = xml.getElementsByTagName("humidity")[0];
      let humidityValue = humidity.getAttribute("value");

      dataToIndicators.push(["Humedad", humidityValue += "%"]);
      

      let indicatorsElements = Array.from(dataToIndicators).map(
        (element) => <Indicator title={element[0]} value={element[1]} />
      )

      setIndicators(indicatorsElements)


    })()
   }, [])

  return (
    <>
      <h1>Dashboard de Clima</h1>
      <h2>Clima Actual</h2>
      <Grid container spacing={5}>
        <Grid xs={6} lg={3}>
          {indicators[0]}
        </Grid>
        <Grid xs={6} lg={3}>
          {indicators[1]}
        </Grid>
        <Grid xs={6} lg={3}>
          {indicators[2]}
        </Grid>
        <Grid xs={6} lg={3}>
          {indicators[3]}
        </Grid>
        <Grid xs={12}>
          <h2>Pronostico de los siguientes dias</h2>
          <BasicTable />
        </Grid>
      </Grid>
    </>
  )
}

export default App
