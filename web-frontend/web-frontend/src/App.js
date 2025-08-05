import logo from './logo.svg';
import './App.css';
import { ResponsiveLine } from '@nivo/line';
import axios from 'axios'
import React, { useState, useEffect } from 'react';



const MyLineChart = ({ data }) => {
  return (
  <ResponsiveLine
    data={data}
    margin={{ top: 100, right: 100, bottom: 200, left: 100 }}
    xScale={{ type: 'point' }}
    yScale={{ 
      type: 'linear', 
      stacked: false,
      min: 'auto',
      max: 'auto'
    }}
    axisBottom={{
      orient: 'bottom',
      legend: 'Time',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      legend: 'Temp F\u00B0',
      legendOffset: '-40',
      legendPosition: 'middle'
    }}
    colors={{ scheme: 'dark2' }}
    pointSize={10}
    pointBorderWidth={2}
    pointLabelYOffset={2}
    useMesh={true}
    theme={{
      // https://nivo.rocks/guides/theming/    for seeing everything in the themes
      background:  "#282c34"
    }}
  />
  )
}







function MyButton() {
  return (
    <button>I'm a button</button>
  )
}



function App2() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("/mock-data.json")
      .then((res) => {
        const rawData = res.data;

        const formatted = [{
          id: "air-temp-data",
          data: rawData.map(point => ({
            x: new Date(point.time).toLocaleTimeString(),
            y: point.value
          }))
        }];

      setChartData(formatted);
  })
  .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="App">
      <h2>InfluxDB Sensor Data</h2>
      <div className='chart-container'></div>
      <MyLineChart data={chartData} />
    </div>
  );
}





function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <MyButton />
      </header>
    </div>
  );
}

export default App2;
