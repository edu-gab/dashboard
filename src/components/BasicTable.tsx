import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface WeatherData {
  date: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
}

export default function BasicTable() {
  const [rows, setRows] = React.useState<WeatherData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const API_KEY = "e3445adc27a6e30de8b74a5ad819d7fb";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=Guayaquil&mode=xml&appid=${API_KEY}`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const periods: WeatherData[] = [];
        const timeElements = xmlDoc.getElementsByTagName("time");

        for (let i = 0; i < timeElements.length; i++) {
          const time = timeElements[i];
          const from = time.getAttribute("from") || "";
          const temperature = parseFloat(time.getElementsByTagName("temperature")[0].getAttribute("value") || "0");
          const windSpeed = parseFloat(time.getElementsByTagName("windSpeed")[0].getAttribute("mps") || "0");
          const humidity = parseInt(time.getElementsByTagName("humidity")[0].getAttribute("value") || "0");
          const precipitation = parseInt(time.getElementsByTagName("precipitation")[0].getAttribute("probability") || "0");

          periods.push({ date: from, temperature, windSpeed, humidity, precipitation });
        }

        setRows(periods);
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxHeight: 400, overflow: 'auto' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Temperatura (°C)</TableCell>
              <TableCell align="right">Velocidad del Viento (m/s)</TableCell>
              <TableCell align="right">Humedad (%)</TableCell>
              <TableCell align="right">Prob. de Precipitación (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.temperature}</TableCell>
                <TableCell align="right">{row.windSpeed}</TableCell>
                <TableCell align="right">{row.humidity}</TableCell>
                <TableCell align="right">{row.precipitation}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Cargando datos...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
