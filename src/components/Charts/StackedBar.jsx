/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
} from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../../contexts/ContextProvider';

const StackedBar = ({ width, height, data, id }) => {
  const { currentMode } = useStateContext();

  const onChartLoad = () => {
    const chart = document.getElementById(`charts${id}`);
    chart.setAttribute('title', 'YoY Comparison');
  };

  return (
    <ChartComponent
      id={`charts${id}`}
      style={{ textAlign: 'center' }}
      legendSettings={{ enableHighlight: true }}
      primaryXAxis={{
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        interval: 1,
        lineStyle: { width: 0 },
        labelIntersectAction: 'Rotate45',
        valueType: 'Category',
      }}
      primaryYAxis={{
        title: 'Vehicles Production (In Millions)',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: '{value}',
      }}
      tooltip={{ enable: true }}
      width={width}
      height={height}
      columnSpacing={2}
      columnWidth={0.75}
      chartArea={{ border: { width: 0 } }}
      title="Motor Vehicle Production by Manufacturer"
      loaded={onChartLoad.bind(this)}
      background={currentMode === 'Dark' ? '#33373E' : 'transparent'}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {data.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default StackedBar;
