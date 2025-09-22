import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, BarSeries, DataLabel } from '@syncfusion/ej2-react-charts';

// Axis configs formerly from dummy.js
const barPrimaryXAxis = { valueType: 'Category', interval: 1, majorGridLines: { width: 0 } };
const barPrimaryYAxis = { majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' } };
import { useStateContext } from '../../contexts/ContextProvider';

const Bar = ({data, id}) => {
  const { currentMode } = useStateContext();

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
        {data.map((item, index) => <SeriesDirective key={index} {...item} />)}
        </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Bar;
