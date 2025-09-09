// ...existing code...
import React, { useEffect, useState } from 'react';

import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';
import ColumnBar from './Charts/ColumnBar';
import LineChart from './Charts/LineChart';
import StackedBar from './Charts/StackedBar';
import Bar from './Charts/Bar';
import PieChart from './Charts/Pie';
import FilterComponent from './FilterComponent';
import Collapse from './Collapse/Collapse';
import Header from './Header';

const ChartsComponent = (props) => {
  const { content, id, hasCollapse, showFilters, chartFilters, filtersBasedOn } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chartControls, setChartControls] = useState();

  const stackedBarChartData = (data, config, filter) => {
    const { mapping, chartSeriesType } = config || {};
    const stackedChartData = [];
    if (mapping && data) {
      mapping.legends.values.forEach((legend) => {
        stackedChartData.push({
          xName: 'x',
          yName: 'y',
          type: chartSeriesType,
          name: legend,
          dataSource:
            data?.length > 0
              ? data
                  .filter((obj) => obj[mapping.legends.key] === legend)
                  .map((obj) => ({
                    x: obj[mapping.stackedXYValues.stackedX],
                    y: obj[filter],
                  }))
                  .sort(
                    (a, b) =>
                      parseFloat(a[mapping.stackedXYValues.stackedX]) -
                      parseFloat(b[mapping.stackedXYValues.stackedX]),
                  )
              : [],
        });
      });
    }

    return stackedChartData;
  };

  const columnBarChartData = (data, config, filter) => {
    const { mapping, chartSeriesType } = config || {};
    const stackedChartData = [];
    if (mapping && data) {
      mapping.legends.values.forEach((legend) => {
        stackedChartData.push({
          xName: 'x',
          yName: 'y',
          type: chartSeriesType,
          name: legend,
          dataSource:
            data.length > 0
              ? data
                  .filter((obj) => obj[mapping.legends.key] === legend)
                  .map((obj) => ({
                    x: obj[mapping.stackedXYValues.stackedX],
                    y: obj[filter],
                  }))
                  .sort(
                    (a, b) =>
                      parseFloat(a[mapping.stackedXYValues.stackedX]) -
                      parseFloat(b[mapping.stackedXYValues.stackedX]),
                  )
              : [],
        });
      });
    }
    return stackedChartData;
  };

  const barChartData = (data, config, filter) => {
    const { mapping, chartSeriesType } = config || {};
    const stackedChartData = [];
    if (mapping && data) {
      mapping.legends.values.forEach((legend) => {
        stackedChartData.push({
          xName: 'x',
          yName: 'y',
          type: chartSeriesType,
          name: legend,
          dataSource: data
            ? data
                .filter((obj) => obj[mapping.legends.key] === legend)
                .map((obj) => ({
                  x: obj[mapping.stackedXYValues.stackedX],
                  y: obj[filter],
                }))
                .sort(
                  (a, b) =>
                    parseFloat(a[mapping.stackedXYValues.stackedX]) -
                    parseFloat(b[mapping.stackedXYValues.stackedX]),
                )
            : [],
        });
      });
    }
    return stackedChartData;
  };

  const lineChartData = (data, config, filter) => {
    const { mapping, chartSeriesType } = config || {};
    const stackedChartData = [];
    if (mapping && data) {
      mapping.legends.values.forEach((legend) => {
        stackedChartData.push({
          xName: 'x',
          yName: 'y',
          type: chartSeriesType,
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          name: legend,
          dataSource: data
            ? data
                .filter((obj) => obj[mapping.legends.key] === legend)
                .map((obj) => ({
                  x: obj[mapping.stackedXYValues.stackedX],
                  y: obj[filter],
                }))
                .sort(
                  (a, b) =>
                    parseFloat(a[mapping.stackedXYValues.stackedX]) -
                    parseFloat(b[mapping.stackedXYValues.stackedX]),
                )
            : [],
        });
      });
    }
    return stackedChartData;
  };

  const pieChartData = (data, config, filter) => {
    const { mapping } = config || {};

    const pieChartDataSource = [];
    let pieChartDataObj = {};
    if (mapping && data && filter) {
      mapping.legends.values.forEach((legend) => {
        data
          .filter((obj) => obj[mapping.legends.key] === legend)
          .forEach((obj) => {
            pieChartDataSource.push({
              x: obj[mapping.stackedXYValues.stackedX],
              y: obj[filter],
            });
          });
      });
    }
    if (pieChartDataSource.length > 0) {
      pieChartDataObj = {
        name: mapping?.legends?.key,
        dataSource: pieChartDataSource,
        xName: 'x',
        yName: 'y',
        innerRadius: '40%',
        startAngle: 0,
        endAngle: 360,
        radius: '70%',
        dataLabel: {
          visible: true,
          name: 'text',
          position: 'Inside',
          font: {
            fontWeight: '600',
            color: '#fff',
          },
        },
      };
    }

    return pieChartDataObj;
  };

  function getMinY(data, filter) {
    return (
      data?.length > 0 &&
      data?.reduce((min, p) => (p?.[filter] < min ? p?.[filter] : min), data[0]?.[filter])
    );
  }
  function getMaxY(data, filter) {
    return (
      data?.length > 0 &&
      data?.reduce((max, p) => (p?.[filter] > max ? p?.[filter] : max), data[0]?.[filter])
    );
  }

  const getChart = React.useCallback((content, id, filter, style) => {
    const { groupData, config } = content;
    let chartData;

    switch (config.variant) {
      case 'stacked-bar':
        chartData = stackedBarChartData(groupData, config, filter);
        return (
          <StackedBar
            key={`key_${id}_${Object.keys(filtersBasedOn)
              ?.map((key) => `${key}_${filtersBasedOn[key]}`)
              ?.join('_')}`}
            data={chartData}
            id={id}
            height="250"
            width={config.hasScroll ? '500' : 'auto'}
            style={style}
            chartXAxis={config.chartXAxis}
            chartYAxis={config.chartYAxis}
          />
        );
      case 'column':
        chartData = columnBarChartData(groupData, config, filter);
        return (
          <ColumnBar
            key={`key-${Object.keys(filtersBasedOn)
              ?.map((key) => `${key}_${filtersBasedOn[key]}`)
              ?.join('_')}`}
            data={chartData}
            id={id}
            height="250"
            width={config.hasScroll ? '500' : 'auto'}
            style={style}
            chartXAxis={config.chartXAxis}
            chartYAxis={config.chartYAxis}
          />
        );
      case 'bar':
        chartData = barChartData(groupData, config, filter);
        return (
          <Bar
            key={`key-${Object.keys(filtersBasedOn)
              ?.map((key) => `${key}_${filtersBasedOn[key]}`)
              ?.join('_')}`}
            data={chartData}
            id={id}
            height="250"
            width={config.hasScroll ? '500' : 'auto'}
            style={style}
            chartXAxis={config.chartXAxis}
            chartYAxis={config.chartYAxis}
          />
        );
      case 'line':
        chartData = lineChartData(groupData, config, filter);
        return (
          <LineChart
            key={`key-${Object.keys(filtersBasedOn)
              ?.map((key) => `${key}_${filtersBasedOn[key]}`)
              ?.join('_')}`}
            data={chartData}
            id={id}
            height="250"
            width={config.hasScroll ? '500' : 'auto'}
            style={style}
            chartXAxis={config.chartXAxis}
            chartYAxis={config.chartYAxis}
          />
        );
      case 'pie':
        chartData = pieChartData(groupData, config, filter);
        return (
          <PieChart
            key={`key-${Object.keys(filtersBasedOn)
              ?.map((key) => `${key}_${filtersBasedOn[key]}`)
              ?.join('_')}`}
            data={chartData}
            id={id}
            legendVisiblity
            height="full"
            style={style}
          />
        );
      default:
        return null;
    }
  }, [filtersBasedOn]);

  const getAxisConfig = React.useCallback((data, axisConfig, filter) => {
    const min = getMinY(data, filter);
    const max = getMaxY(data, filter);

    if (min !== undefined && max !== undefined && axisConfig) {
      axisConfig.minimum = min;
      axisConfig.maximum = max;
      axisConfig.interval = (max - min) / 3;
    }

    return axisConfig;
  }, []);

  useEffect(() => {
    if (chartControls) {
      getChart(content, id, chartControls, { overflowX: 'scroll' });
      getAxisConfig(content?.groupData, content?.config?.chartYAxis, chartControls?.lob);
    }
  }, [chartControls, content, id, getChart, getAxisConfig]);

  const filtersBasedOnKeys = React.useMemo(() => Object.keys(filtersBasedOn)?.map((key) => `${key}_${filtersBasedOn[key]}`)?.join('_'), [filtersBasedOn]);
  useEffect(() => {
    if (filtersBasedOn) {
      getChart(content, id, filtersBasedOn, { overflowX: 'scroll' });
      getAxisConfig(
        content?.groupData,
        content?.config?.chartYAxis,
        filtersBasedOn?.premiumFilters,
      );
    }
  }, [id, filtersBasedOn, filtersBasedOnKeys, content, getChart, getAxisConfig]);

  return (
    <Collapse
      show={hasCollapse}
      isCollapsed={isCollapsed}
      collapseComponent={
        <Header
          show={hasCollapse}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          title={`${content.config.chartTitle} - ${chartControls?.lob}` || ''}
          collapseButton={
            <button
              className="collapse-button"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <BsChevronDoubleRight /> : <BsChevronDoubleDown />}
            </button>
          }
          showFilters={showFilters}
          filtersComponent={
            <FilterComponent
              filters={chartFilters}
              onChange={(val) => setChartControls(val)}
              style={chartFilters?.style}
            />
          }
          {...props}
        />
      }
    >
      <div
        className="w-full chartWrapper"
        style={content.config.hasScroll ? { overflowX: 'scroll' } : {}}
      >
        {content &&
          getChart(
            content,
            id,
            filtersBasedOn?.premiumFilters,
            content.config.hasScroll ? { overflowX: 'scroll' } : {},
          )}
      </div>
    </Collapse>
  );
};

export default ChartsComponent;
