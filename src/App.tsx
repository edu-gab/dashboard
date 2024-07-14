import { useEffect, useState } from 'react';
import './App.css';
import Indicator from './components/Indicator';
import Grid from '@mui/material/Grid';
import BasicTable from './components/BasicTable';
import TemperatureChart from './components/TemperatureChart'; 

function App() {
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let savedTextXML = localStorage.getItem("openWeatherMap");
        let expiringTime = localStorage.getItem("expiringTime");
        let nowTime = new Date().getTime();

        if (expiringTime === null || nowTime > parseInt(expiringTime)) {
          let API_KEY = "e3445adc27a6e30de8b74a5ad819d7fb";
          let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=Guayaquil&mode=xml&appid=${API_KEY}`);
          savedTextXML = await response.text();

          let hours = 1;
          let delay = hours * 3600000;

          localStorage.setItem("openWeatherMap", savedTextXML);
          localStorage.setItem("expiringTime", (nowTime + delay).toString());
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        let dataToIndicators = [];

        let location = xml.getElementsByTagName("city")[0];
        let name = location.getAttribute("name");

        dataToIndicators.push(["Lugar", name]);

        let temperature = xml.getElementsByTagName("temperature")[0];
        let temperatureValue = temperature.getAttribute("value");

        dataToIndicators.push(["Temperatura", temperatureValue + "°C"]);

        let wind = xml.getElementsByTagName("speed")[0];
        let speedValue = wind.getAttribute("value");

        dataToIndicators.push(["Velocidad del Viento", speedValue + "m/s"]);

        let humidity = xml.getElementsByTagName("humidity")[0];
        let humidityValue = humidity.getAttribute("value");

        dataToIndicators.push(["Humedad", humidityValue + "%"]);

        let indicatorsElements = dataToIndicators.map(
          (element, index) => <Grid key={index} item xs={6} lg={3}><Indicator title={element[0]} value={element[1]} /></Grid>
        );

        setIndicators(indicatorsElements);
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Dashboard de Clima</h1>
      <h2>Clima Actual</h2>
     
      <Grid container spacing={5}>
        <Grid item xs={12}>
        </Grid>
        {indicators}
        <Grid item xs={12}>
          <h2>Pronóstico de los siguientes días</h2>
          <BasicTable />
        </Grid>
        <Grid item xs={20} style={{justifyContent: 'center'}}>
          <h2>Grafica de Clima</h2>
          <TemperatureChart />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
