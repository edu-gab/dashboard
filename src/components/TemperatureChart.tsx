import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import Paper from '@mui/material/Paper';

interface WeatherData {
    date: string;
    temperature: number;
}

export default function WeatherChart() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const fetchWeatherData = async () => {
        try {
            const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&q=Guayaquil&appid=e3445adc27a6e30de8b74a5ad819d7fb');
            const data = await response.json();
            const processedData = data.list.map((item: any) => ({
                date: item.dt_txt,
                temperature: item.main.temp
            }));
            setWeatherData(processedData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const options = {
        title: 'Temperatura en Guayaquil',
        curveType: 'function',
        legend: { position: 'right' },
        hAxis: {
            title: 'Fecha',
        },
        vAxis: {
            title: 'Temperatura (°C)',
        },
    };

    const chartData = weatherData.map((item) => [item.date, item.temperature]);

    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Chart
                chartType="LineChart"
                data={[['Fecha', 'Temperatura'], ...chartData]}
                width="100%"
                height="400px"
                options={options}
            />
        </Paper>
    );
}
