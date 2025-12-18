/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Plot from 'react-plotly.js';
import { useStateContext } from '../../contexts/ContextProvider';

const Doughnut = ({ id, data, legendVisiblity, height }) => {
  const { currentMode } = useStateContext();

  let plotData = [];

  if (Array.isArray(data)) {
    if (data.length > 0 && data[0].dataSource) {
      // Syncfusion format
      plotData = [{
        type: 'pie',
        labels: data[0]?.dataSource?.map(item => item.x) || [],
        values: data[0]?.dataSource?.map(item => item.y) || [],
        name: data[0]?.name || 'Pie Chart',
        hole: 0.4,
        marker: {
          colors: data[0]?.palettes || ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']
        }
      }];
    } else if (data.length > 0 && (data[0].channel || data[0].x) && (data[0].value || data[0].y || data[0].wpi || data[0].ape)) {
      // Direct format: array of objects with channel/value fields
      const xField = data[0].x ? 'x' : 'channel';
      const yField = data[0].y ? 'y' : (data[0].wpi ? 'wpi' : (data[0].ape ? 'ape' : 'value'));
      plotData = [{
        type: 'pie',
        labels: data.map(item => item[xField]),
        values: data.map(item => item[yField]),
        name: 'Distribution',
        hole: 0.4,
        marker: {
          colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']
        }
      }];
    }
  } else if (data && data.dataSource) {
    // Object format from pieChartData function
    plotData = [{
      type: 'pie',
      labels: data.dataSource?.map(item => item.x) || [],
      values: data.dataSource?.map(item => item.y) || [],
      name: data.name || 'Pie Chart',
      hole: 0.4,
      marker: {
        colors: data.palettes || ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']
      }
    }];
  }

  const layout = {
    height: height || 400,
    margin: { l: 20, r: 20, t: 20, b: 20 },
    paper_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    plot_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    font: {
      color: currentMode === 'Dark' ? '#fff' : '#333'
    },
    showlegend: legendVisiblity !== false
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      config={config}
      style={{ width: '100%', height: height || '400px' }}
      useResizeHandler={true}
    />
  );
};

export default Doughnut;
