import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, ColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';

import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';

const StackedBar = ({ width, height, data, id, style, chartXAxis, chartYAxis }) => {
  const { currentMode } = useStateContext();
  console.log("datat===", data)

  return <>{data && (
    <ChartComponent
      id={`charts${id}`}
      primaryXAxis={chartXAxis}
      primaryYAxis={chartYAxis}
      width={width}
      height={height}
      style={style}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : 'transparent'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {data.map((item, index) => <SeriesDirective key={index} {...item} />)}
      </SeriesCollectionDirective>
    </ChartComponent>
  )}</>;
};

export default StackedBar;
