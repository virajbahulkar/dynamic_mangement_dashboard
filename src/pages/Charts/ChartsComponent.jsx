import React from 'react';

import { ChartsHeader, LineChart, StackedBar, Stacked, Pie as PieChart } from '../../components';


const getChart = (config, id) => {
    console.log("config", config)
    console.log("id", id)
    switch (config.variant) {
        case "stacked-bar":
            console.log("variant", config.variant)
            return (<StackedBar data={config.data} id={id} height={"250"}/>)
        case "bar":
            console.log("variant", config.variant)
                return (<Stacked  data={config.data} id={id} />) 
        case "line":
            console.log("variant", config.variant)
            return (<LineChart data={config.data} id={id} />)         
        case "pie":
            console.log("variant", config.variant)
            return (<PieChart  data={config.data} id={id} legendVisiblity height="full" />)
        default:
            break;
    }
}

const ChartsComponent = ({config, id}) => (
  <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl">
    <ChartsHeader category="Line" title="Inflation Rate" />
    <div className="w-full">
        {config && getChart(config, id)}
    </div>
  </div>
);

export default ChartsComponent;
