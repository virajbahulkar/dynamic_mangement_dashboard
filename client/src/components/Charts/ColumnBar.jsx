/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, ColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../contexts/ContextProvider';

const stackedPrimaryXAxis = { majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, interval: 1, lineStyle: { width: 0 }, labelIntersectAction: 'Rotate45', valueType: 'Category' };
const stackedPrimaryYAxis = { lineStyle: { width: 0 }, minimum: 0, maximum: 2000, interval: 400, majorTickLines: { width: 0 }, majorGridLines: { width: 1 }, minorGridLines: { width: 1 }, minorTickLines: { width: 0 }, labelFormat: '{value}' };

const ColumnBar = ({ width, height, data, id, style }) => {
  const { currentMode } = useStateContext();
  const raw = Array.isArray(data) ? data : (data ? [data] : []);
  const series = raw.map(s => ({ type: s.type || 'Column', ...s }));

  return (
  <>{series.length > 0 && (
    <ChartComponent
      id={`charts${id}`}
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      width={width}
      style={style}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[ColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
  {series.map((item, index) => <SeriesDirective key={index} {...item} />)}
      </SeriesCollectionDirective>
    </ChartComponent>
    )}
    </>
  );
};

export default ColumnBar;
