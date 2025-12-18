/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import Plot from 'react-plotly.js';
import { useStateContext } from '../../contexts/ContextProvider';

const ColumnBar = ({ width, height, data, id, style, chartXAxis, chartYAxis }) => {
  const { currentMode } = useStateContext();
  const raw = Array.isArray(data) ? data : (data ? [data] : []);

  let plotData = [];

  if (raw.length > 0 && raw[0].dataSource) {
    // Syncfusion format: array of series with dataSource
    plotData = raw.map((series, index) => {
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
        type: 'bar',
        orientation: 'v', // vertical bars (columns)
        x: xData,
        y: yData,
        name: series.name || `Series ${index + 1}`,
        marker: {
          color: series.fill || '#8884d8'
        }
      };
    });
  } else if (raw.length > 0 && (raw[0].channel || raw[0].x || Object.keys(raw[0]).length > 0)) {
    // Direct format: array of objects with any fields
    const firstItem = raw[0];
    
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
      type: 'bar',
      orientation: 'v',
      x: raw.map(item => item[xField]),
      y: raw.map(item => item[yField]),
      name: 'Data',
      marker: {
        color: '#8884d8'
      }
    }];
  }

  const layout = {
    width: width,
    height: height,
    margin: { l: 50, r: 50, t: 20, b: 100 }, // Extra bottom margin for rotated labels
    paper_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    plot_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    font: {
      color: currentMode === 'Dark' ? '#fff' : '#333'
    },
    xaxis: {
      showgrid: true,
      gridcolor: currentMode === 'Dark' ? '#444' : '#e0e0e0',
      tickangle: 45
    },
    yaxis: {
      showgrid: true,
      gridcolor: currentMode === 'Dark' ? '#444' : '#e0e0e0',
      range: [0, 2000]
    },
    showlegend: true,
    ...style
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <>
      {plotData.length > 0 && (
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: width || '100%', height: height || '400px' }}
          useResizeHandler={true}
        />
      )}
    </>
  );
};

export default ColumnBar;
