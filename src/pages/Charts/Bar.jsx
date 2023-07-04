//import './index.css';
/**
 * Sample for Bar series
 */
 import * as React from "react";
 import { useEffect } from 'react';
 import { StackingColumnSeries,  ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, DataLabel, BarSeries, Category, Legend, Tooltip, Highlight } from '@syncfusion/ej2-react-charts';
 import { Browser } from '@syncfusion/ej2-base';
 
 export let data1 = [
   { x: '2013', y: 9628912 },
   { x: '2014', y: 9609326 },
   { x: '2015', y: 7485587 },
   { x: '2016', y: 7793066 },
   { x: '2017', y: 6856880 }
 ];
 export let data2 = [
   { x: '2013', y: 4298390 },
   { x: '2014', y: 4513769 },
   { x: '2015', y: 4543838 },
   { x: '2016', y: 4999266 },
   { x: '2017', y: 5235842 }
 ];
 export let data3 = [
   { x: '2013', y: 2842133 },
   { x: '2014', y: 3016710 },
   { x: '2015', y: 3034081 },
   { x: '2016', y: 2945295 },
   { x: '2017', y: 3302336 }
 ];
 export let data4 = [
   { x: '2013', y: 2006366 },
   { x: '2014', y: 2165566 },
   { x: '2015', y: 2279503 },
   { x: '2016', y: 2359756 },
   { x: '2017', y: 2505741 }
 ];
 const SAMPLE_CSS = `
   .control-fluid {
       padding: 0px !important;
   }`;
 const Bar = () => {
   // useEffect(() => {
   //     updateSampleSection();
   // }, []);
   const onChartLoad = (args) => {
       let chart = document.getElementById('charts');
       chart.setAttribute('title', '');
   };
   const load = (args) => {
       let selectedTheme = location.hash.split('/')[1];
       selectedTheme = selectedTheme ? selectedTheme : 'Material';
       args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast');
   };
   const axisLabelRender = (args) => {
       args.text = args.text.replace("0000000", "0M").replace("000000", "M");
   };
   return (<div className='control-pane'>
           <style>{SAMPLE_CSS}</style>
           <div className='control-section'>
               <ChartComponent id='charts' height='350' style={{ textAlign: "center" }} legendSettings={{ enableHighlight: true }} primaryXAxis={{ majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, interval: 1, lineStyle: { width: 0 }, labelIntersectAction: 'Rotate45', valueType: 'Category' }} primaryYAxis={{ title: 'Vehicles Production (In Millions)', lineStyle: { width: 0 }, majorTickLines: { width: 0 }, majorGridLines: { width: 1 }, minorGridLines: { width: 1 }, minorTickLines: { width: 0 }, labelFormat: '{value}' }} width={'100%'} chartArea={{ border: { width: 0 } }} load={load.bind(this)} title='Motor Vehicle Production by Manufacturer' loaded={onChartLoad.bind(this)} tooltip={{ enable: true }} axisLabelRender={axisLabelRender.bind(this)}>
                   <Inject services={[StackingColumnSeries, Category, Legend, Tooltip, Highlight]}/>
                   <SeriesCollectionDirective>
                       <SeriesDirective dataSource={data1} xName='x' yName='y' name='General Motors' columnSpacing={0.8} columnWidth={2} border={{ width: 1, color: "white" }} type='StackingColumn'/>
                       <SeriesDirective dataSource={data2} xName='x' yName='y' name='Honda' columnSpacing={0.8} columnWidth={2} border={{ width: 1, color: "white" }} type='StackingColumn'/>
                       <SeriesDirective dataSource={data3} xName='x' yName='y' name='Suzuki' columnSpacing={0.8} columnWidth={2} border={{ width: 1, color: "white" }} type='StackingColumn'/>
                       <SeriesDirective dataSource={data4} xName='x' yName='y' name='BMW' columnSpacing={0.8} columnWidth={2} border={{ width: 1, color: "white" }} type='StackingColumn'/>
                   </SeriesCollectionDirective>
               </ChartComponent>
               
           </div>
       </div>);
 };
 export default Bar;
 