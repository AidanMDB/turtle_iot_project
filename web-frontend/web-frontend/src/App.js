//import logo from './logo.svg';
import './App.css';
import { Line, ResponsiveLine } from '@nivo/line';
import axios from 'axios'
import React, { useState, useEffect } from 'react';



const RecentReading = ({ data }) => {
  if (!data || data.length === 0) return <p>No Data Available</p>

  const latest = data[0];
  const data_name = latest.id
  const latest_data = latest.data[0]
  const [key] = Object.keys(latest_data).filter(k => k !== 'x');
  
  const data_recent_value = latest_data[key]
  

  return (
    <div className='recent-reading-container'>
      <h3>{data_name}</h3>
      <h1>{data_recent_value}{" \u00B0F"}</h1>
    
    </div>

  );
}


const LineChart = ({ data }) => {
  return (
    <div className='line-graph-container'>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 50, bottom: 50, left: 50 }}
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
          background:  "#282c34",
          text: {
            fontSize: 11,
            fill: "#ffffffff"
          },
          
        }}
      />
    </div>
  );
}



const LineChartWithRecentValue = ({ data }) => {
  return (
    <div className="graph-recent-container">
      <RecentReading data={data}/>
      <LineChart data={data}/>
    </div>
  )
}




/* function MyButton() {
  return (
    <button>I'm a button</button>
  )
} */



function App() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("/mock-line-graph-data.json")
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

  console.log(chartData)

  return (
    <div className="App">
      <h2>Turtle IoT</h2>
      <div className='chart-container'></div>
      <LineChartWithRecentValue data={chartData} />
    </div>
  );
}





/* function App() {
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
} */

export default App;
