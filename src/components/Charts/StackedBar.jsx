import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, ColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';

import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';

const StackedBar = ({ width, height, data, id, style, chartXAxis, chartYAxis }) => {
  const { currentMode } = useStateContext();

  const onChartLoad = (args) => {
    let chart = document.getElementById(`charts${id}`);
    chart.setAttribute('title', 'YoY Comparison');
  };

  return <>{(
    <ChartComponent
      id={`charts${id}`}
      style={{ textAlign: "center" }}
      legendSettings={{ enableHighlight: true }}
      primaryXAxis={{
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }, interval: 1, lineStyle: { width: 0 },
        labelIntersectAction: 'Rotate45', valueType: 'Category'
      }}
      primaryYAxis={{
        title: 'Vehicles Production (In Millions)',
        lineStyle: { width: 0 }, majorTickLines: { width: 0 },
        majorGridLines: { width: 1 }, minorGridLines: { width: 1 },
        minorTickLines: { width: 0 }, labelFormat: '{value}'
      }}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      title='Motor Vehicle Production by Manufacturer'
      loaded={onChartLoad.bind(this)}
      background={currentMode === 'Dark' ? '#33373E' : 'transparent'}
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
