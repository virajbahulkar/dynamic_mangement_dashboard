import React from 'react';

import { ChartsHeader, LineChart, StackedBar, Stacked, Pie as PieChart } from '../../components';


const getChart = (config) => {
    console.log("config", config)
    switch (config.variant) {
        case "stacked-bar":
            console.log("variant", config.variant)
            return (<StackedBar data={config.data} />)
        case "bar":
            console.log("variant", config.variant)
                return (<Stacked  data={config.data} />) 
        case "line":
            console.log("variant", config.variant)
            return (<LineChart data={config.data} />)         
        case "pie":
            console.log("variant", config.variant)
            return (<PieChart id="chart-pie" data={config.data} legendVisiblity height="full" />)
        default:
            break;
    }
}

const ChartsComponent = ({config}) => (
  <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl">
    <ChartsHeader category="Line" title="Inflation Rate" />
    <div className="w-full">
        {config && getChart(config)}
    </div>
  </div>
);

export default ChartsComponent;
