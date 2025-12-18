import React from 'react';
import Plot from 'react-plotly.js';
import { useStateContext } from '../../contexts/ContextProvider';

const Bar = ({data, id, chartXAxis, chartYAxis}) => {
  const { currentMode } = useStateContext();

  console.log('Bar component received data:', data);
  console.log('Data type:', typeof data);
  console.log('Is array:', Array.isArray(data));
  if (Array.isArray(data) && data.length > 0) {
    console.log('First item:', data[0]);
    console.log('Has dataSource:', 'dataSource' in data[0]);
    console.log('Has channel:', 'channel' in data[0]);
  }

  // Handle different data formats
  let plotData = [];

  if (Array.isArray(data)) {
    // Check if data is already in {x, y} format (from ChartsComponent processing)
    if (data.length > 0 && data[0].dataSource) {
      console.log('Using dataSource format');
      // Syncfusion format: array of series with dataSource
      plotData = data.map((series, index) => {
        const dataSource = series.dataSource || [];
        console.log(`Series ${index}:`, { name: series.name, dataSource });
        
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
          
          console.log(`Using fields for Series ${index}:`, { xField, yField, fromConfig: !!(chartXAxis || chartYAxis) });
          
          xData = dataSource.map(item => item[xField]);
          yData = dataSource.map(item => item[yField]);
        }
        
        console.log(`Series ${index}:`, { xData, yData });
        
        return {
          type: 'bar',
          x: xData,
          y: yData,
          name: series.name || `Series ${index + 1}`,
          marker: {
            color: series.fill || '#8884d8'
          }
        };
      });
    } else if (data.length > 0 && (data[0].channel || data[0].x || Object.keys(data[0]).length > 0)) {
      console.log('Using direct object format');
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
      
      console.log('Using fields:', { xField, yField, fromConfig: !!(chartXAxis || chartYAxis) });
      plotData = [{
        type: 'bar',
        x: data.map(item => item[xField]),
        y: data.map(item => item[yField]),
        name: 'Data',
        marker: {
          color: '#8884d8'
        }
      }];
    }
  }

  console.log('Final plotData:', plotData);
  console.log('Plot data details:', plotData.map((d, i) => ({ index: i, name: d.name, xLength: d.x?.length, yLength: d.y?.length })));

  // If no data, show sample data for testing
  const hasValidData = plotData.length > 0 && plotData.some(d => d.x && d.x.length > 0 && d.y && d.y.length > 0);
  console.log('Has valid data:', hasValidData);
  const finalPlotData = hasValidData ? plotData : [{
    type: 'bar',
    x: ['DIGITAL', 'AGENT'],
    y: [120, 80],
    name: 'Sample Data',
    marker: { color: '#8884d8' }
  }];

  console.log('Final plot data to render:', finalPlotData);

  const layout = {
    height: 250,
    margin: { l: 50, r: 50, t: 20, b: 50 },
    paper_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    plot_bgcolor: currentMode === 'Dark' ? '#33373E' : '#fff',
    font: {
      color: currentMode === 'Dark' ? '#fff' : '#333'
    },
    xaxis: {
      showgrid: false,
      showticklabels: true
    },
    yaxis: {
      showgrid: false,
      showticklabels: false,
      showline: false
    },
    showlegend: true
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Plot
      data={finalPlotData}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '250px' }}
      useResizeHandler={true}
    />
  );
};

export default Bar;
