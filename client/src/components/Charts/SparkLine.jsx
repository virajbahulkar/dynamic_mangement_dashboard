import React from 'react';
import Plot from 'react-plotly.js';

class SparkLine extends React.PureComponent {
  render() {
    const { id, height, width, color, data, type, currentColor } = this.props;

    // Transform data for Plotly
    const plotData = [{
      type: 'scatter',
      mode: 'lines',
      x: data?.map(item => item.x) || [],
      y: data?.map(item => item.yval) || [],
      line: {
        color: color || currentColor,
        width: 1
      },
      marker: {
        color: currentColor,
        size: 2.5
      },
      showlegend: false,
      hovertemplate: '%{x} : data %{y}<extra></extra>'
    }];

    const layout = {
      width: width,
      height: height,
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: {
        showgrid: false,
        showticklabels: false,
        showline: false,
        zeroline: false
      },
      yaxis: {
        showgrid: false,
        showticklabels: false,
        showline: false,
        zeroline: false
      }
    };

    const config = {
      displayModeBar: false,
      responsive: false
    };

    return (
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: width || '100%', height: height || '50px' }}
      />
    );
  }
}

export default SparkLine;
