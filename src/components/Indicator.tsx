import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import './Indicator.css';

interface Config{
    title?: String;
    value: Number
}

export default function Indicator(config: Config){
    return(
            <Paper id="indicator-paper"
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
                }}
            >
                <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{textAlign: 'center', color: '#000000'}}>
                    {config.title} 
                </Typography>
                <Typography component="p" variant="h4">
                    {config.value.toString()}
                </Typography>
            </Paper> 
    )
}