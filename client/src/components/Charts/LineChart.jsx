import React from 'react';
import Plot from 'react-plotly.js';
import { useStateContext } from '../../contexts/ContextProvider';

const LineChart = ({ width, height, data, id, style, chartXAxis, chartYAxis }) => {
  const { currentMode } = useStateContext();

  let plotData = [];

  if (Array.isArray(data)) {
    if (data.length > 0 && data[0].dataSource) {
      // Syncfusion format: array of series with dataSource
      plotData = data.map((series, index) => {
        const dataSource = series.dataSource || [];
        let xData = [];
        let yData = [];
        
        if (dataSource.length > 0) {
          // Use configured fields if available, otherwise auto-detect
          const firstItem = dataSource[0];
          
          let xField, yField;
          
          if (chartXAxis && chartXAxis.dataField) {
            xField = chartXAxis.dataField;
          } else {
            // Auto-detect X field: prefer string fields for categorical data
            xField = Object.keys(firstItem).find(key => 
              typeof firstItem[key] === 'string' && firstItem[key] && key !== 'id'
            ) || Object.keys(firstItem)[0];
          }
          
          if (chartYAxis && chartYAxis.dataField) {
            yField = chartYAxis.dataField;
          } else {
            // Auto-detect Y field: prefer numeric fields for values
            yField = Object.keys(firstItem).find(key => 
              typeof firstItem[key] === 'number' && firstItem[key] !== null && firstItem[key] !== undefined
            ) || Object.keys(firstItem).find(key => 
              !isNaN(parseFloat(firstItem[key])) && isFinite(firstItem[key])
            ) || Object.keys(firstItem)[1] || Object.keys(firstItem)[0];
          }
          
          xData = dataSource.map(item => item[xField]);
          yData = dataSource.map(item => item[yField]);
        }
        
        return {
          type: 'scatter',
          mode: 'lines+markers',
          x: xData,
          y: yData,
          name: series.name || `Series ${index + 1}`,
          line: {
            color: series.fill || '#8884d8',
            width: 2
          },
          marker: {
            size: 6
          }
        };
      });
    } else if (data.length > 0 && (data[0].channel || data[0].x || Object.keys(data[0]).length > 0)) {
      // Direct format: array of objects with any fields
      const firstItem = data[0];
      
      let xField, yField;
      
      if (chartXAxis && chartXAxis.dataField) {
        xField = chartXAxis.dataField;
      } else {
        // Auto-detect X field: prefer string fields for categorical data
        xField = Object.keys(firstItem).find(key => 
          typeof firstItem[key] === 'string' && firstItem[key] && key !== 'id'
        ) || Object.keys(firstItem)[0];
      }
      
      if (chartYAxis && chartYAxis.dataField) {
        yField = chartYAxis.dataField;
      } else {
        // Auto-detect Y field: prefer numeric fields for values
        yField = Object.keys(firstItem).find(key => 
          typeof firstItem[key] === 'number' && firstItem[key] !== null && firstItem[key] !== undefined
        ) || Object.keys(firstItem).find(key => 
          !isNaN(parseFloat(firstItem[key])) && isFinite(firstItem[key])
        ) || Object.keys(firstItem)[1] || Object.keys(firstItem)[0];
      }
      plotData = [{
        type: 'scatter',
        mode: 'lines+markers',
        x: data.map(item => item[xField]),
        y: data.map(item => item[yField]),
        name: 'Values',
        line: {
          color: '#8884d8',
          width: 2
        },
        marker: {
          size: 6
        }
      }];
    }
  }

  const layout = {
    width: width,
    height: height,
    margin: { l: 50, r: 50, t: 20, b: 50 },
    paper_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    plot_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    font: {
      color: currentMode === 'Dark' ? '#fff' : '#333'
    },
    xaxis: {
      showgrid: true,
      gridcolor: currentMode === 'Dark' ? '#444' : '#e0e0e0',
      ...chartXAxis
    },
    yaxis: {
      showgrid: true,
      gridcolor: currentMode === 'Dark' ? '#444' : '#e0e0e0',
      ...chartYAxis
    },
    showlegend: true
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
      style={{ width: width || '100%', height: height || '400px', ...style }}
      useResizeHandler={true}
    />
  );
};

export default LineChart;
