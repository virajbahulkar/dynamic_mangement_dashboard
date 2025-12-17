import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, BarSeries, DataLabel } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../contexts/ContextProvider';

// Axis configs formerly from dummy.js
const barPrimaryXAxis = { valueType: 'Category', interval: 1, majorGridLines: { width: 0 } };
const barPrimaryYAxis = { majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' } };

const Bar = ({data, id}) => {
  const { currentMode } = useStateContext();
  const raw = Array.isArray(data) ? data : (data ? [data] : []);
  const series = raw.map(s => ({ type: s.type || 'Bar', ...s }));

  return (
    <ChartComponent
        id={`charts${id}`}
        primaryXAxis={barPrimaryXAxis}
        primaryYAxis={barPrimaryYAxis}
        height='250'
        chartArea={{ border: { width: 0 } }}
        tooltip={{ enable: true }}
        background={currentMode === 'Dark' ? '#33373E' : '#fff'}
        legendSettings={{ background: 'white' }}
    >
        <Inject services={[BarSeries, Legend, Tooltip, Category, DataLabel]} />
        <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
  {series.map((item, index) => <SeriesDirective key={index} {...item} />)}
        </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Bar;
