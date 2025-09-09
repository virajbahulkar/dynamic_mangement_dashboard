import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, PolarSeries, RadarSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../contexts/ContextProvider';

const LineChart = ({ width, height, data, id, style, chartXAxis, chartYAxis }) => {
  const { currentMode } = useStateContext();

  return (
    <ChartComponent
      id={`line-chart${id}`}
      primaryXAxis={chartXAxis}
      primaryYAxis={chartYAxis}
      width={width}
      height={height}
      style={style}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[LineSeries, PolarSeries, RadarSeries, DateTime, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {data.map((item, index) => <SeriesDirective key={index} {...item} />)}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;
