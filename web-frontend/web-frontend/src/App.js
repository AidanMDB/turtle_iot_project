import logo from './logo.svg';
import './App.css';
import { ResponsiveLine } from '@nino/line';
import axios from 'axios'

const MyLineChart = ({ data }) => {
  <ResponsiveLine
    data={data}
    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
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
      legend: 'Value',
      legendOffset: '-40',
      legendPosition: 'middle'
    }}
    colors={{ scheme: 'nivo' }}
    pointSize={10}
    pointBorderWidth={2}
    pointLabelYOffset={2}
    useMesh={true}
  />
}


function MyButton() {
  return (
    <button>I'm a button</button>
  )
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

export default App;
