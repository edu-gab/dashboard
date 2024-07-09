import { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import './App.css'
import Indicator from './components/Indicator'
import Summary from './components/Summary'
import BasicTable from './components/BasicTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Grid container spacing={5}>
      <Grid xs={6} md={4} lg={3}>
        <Indicator title="Precipitacion" subtitle="Probabilidad" value={0.13} />
      </Grid>
      <Grid xs={6} md={4} lg={3}>
        <Summary></Summary>
      </Grid>
      <Grid xs={6} md={4} lg={12}>
        <BasicTable></BasicTable>
      </Grid>
    </Grid>
  )
}

export default App