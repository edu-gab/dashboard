import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface WeatherData {
    date: string;
    temperature?: number;
    humidity?: number;
    precipitation?: number;
}

export default function WeatherChart() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [dataType, setDataType] = useState<'temperature' | 'humidity' | 'precipitation'>('temperature');

    useEffect(() => {
        fetchWeatherData();
    }, [dataType]);

    const fetchWeatherData = async () => {
        try {
            const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&q=Guayaquil&appid=e3445adc27a6e30de8b74a5ad819d7fb&mode=xml');
            const textData = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textData, 'text/xml');
            const timeNodes = xmlDoc.getElementsByTagName('time');
            const processedData = Array.from(timeNodes).map((item: any) => ({
                date: item.getAttribute('from'),
                temperature: parseFloat(item.getElementsByTagName('temperature')[0].getAttribute('value')),
                humidity: parseFloat(item.getElementsByTagName('humidity')[0].getAttribute('value')),
                precipitation: parseFloat(item.getElementsByTagName('precipitation')[0]?.getAttribute('value') || '0')
            }));
            setWeatherData(processedData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const options = {
        title: 'Clima en Guayaquil',
        curveType: 'function',
        legend: { position: 'right' },
        hAxis: {
            title: 'Fecha',
        },
        vAxis: {
            title: dataType === 'temperature' ? 'Temperatura (°C)' : dataType === 'humidity' ? 'Humedad (%)' : 'Precipitación (mm)',
        },
    };

    const chartData = weatherData.map((item) => [item.date, item[dataType]]);

    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#d4eaf7'}}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="data-type-label">Tipo de Datos</InputLabel>
                <Select
                    labelId="data-type-label"
                    id="data-type-select"
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value as 'temperature' | 'humidity' | 'precipitation')}
                    label="Tipo de Datos"
                >
                    <MenuItem value="temperature">Temperatura</MenuItem>
                    <MenuItem value="humidity">Humedad</MenuItem>
                    <MenuItem value="precipitation">Precipitación</MenuItem>
                </Select>
            </FormControl>
            <Chart
                chartType="LineChart"
                data={[['Fecha', dataType === 'temperature' ? 'Temperatura' : dataType === 'humidity' ? 'Humedad' : 'Precipitación'], ...chartData]}
                width="100%"
                height="400px"
                options={options}
            />
        </Paper>
    );
}
