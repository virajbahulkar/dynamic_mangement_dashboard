import React, { useEffect, useState } from 'react';

import { LineChart, StackedBar, Bar, Pie as PieChart, Header } from '.';
import ColumnBar from './Charts/ColumnBar';
import FilterComponent from './FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import Collapse from './Collapse/Collapse';
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';

const ChartsComponent = (props) => {

    const { content, id, hasCollapse, showFilters, filters } = props

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [chartControls, setChartControls] = useState()
    useEffect(() => {
        if (chartControls) {
            getChart(content, id, chartControls, { overflowX: 'scroll' })
            getAxisConfig(content?.groupData, content?.config?.chartYAxis, chartControls?.lob)

        }
    }, [chartControls?.lob])

    const stackedBarChartData = (data, config, filter) => {
        const { mapping, chartSeriesType } = config || {}
        let stackedChartData = []
        if (mapping && data) {
            mapping.legends.values.forEach((legend, index) => {
                stackedChartData.push({
                    xName: 'x',
                    yName: 'y',
                    type: chartSeriesType,
                    name: legend,
                    dataSource: data?.map((obj) => (obj[mapping.legends.key] === legend) && ({
                        ["x"]: obj[mapping.stackedXYValues.stackedX],
                        ["y"]: obj[filter],
                    })).filter(Boolean).sort(function (a, b) {
                        return parseFloat(a[mapping.stackedXYValues.stackedX]) - parseFloat(b[mapping.stackedXYValues.stackedX]);
                    })
                });
            })
        }


        return stackedChartData
    }

    const columnBarChartData = (data, config, filter) => {
        const { mapping, chartSeriesType } = config || {}
        let stackedChartData = []
        if (mapping && data) {
            mapping.legends.values.forEach((legend, index) => {
                stackedChartData.push({
                    xName: 'x',
                    yName: 'y',
                    type: chartSeriesType,
                    name: legend,
                    dataSource: data?.map((obj) => obj[mapping.legends.key] === legend && ({
                        ["x"]: obj[mapping.stackedXYValues.stackedX],
                        ["y"]: obj[filter],
                    })).filter(Boolean).sort(function (a, b) {
                        return parseFloat(a[mapping.stackedXYValues.stackedX]) - parseFloat(b[mapping.stackedXYValues.stackedX]);
                    })
                })
            })
        }
        return stackedChartData
    }

    const barChartData = (data, config, filter) => {
        const { mapping, chartSeriesType } = config || {}
        let stackedChartData = []
        if (mapping && data) {
            mapping.legends.values.forEach((legend, index) => {
                stackedChartData.push({
                    xName: 'x',
                    yName: 'y',
                    type: chartSeriesType,
                    name: legend,
                    dataSource: data?.map((obj) => obj[mapping.legends.key] === legend && ({
                        ["x"]: obj[mapping.stackedXYValues.stackedX],
                        ["y"]: obj[filter],
                    })).filter(Boolean).sort(function (a, b) {
                        return parseFloat(a[mapping.stackedXYValues.stackedX]) - parseFloat(b[mapping.stackedXYValues.stackedX]);
                    })
                })
            })
        }
        return stackedChartData
    }

    const lineChartData = (data, config, filter) => {
        const { mapping, chartSeriesType } = config || {}
        let stackedChartData = []
        if (mapping && data) {
            mapping.legends.values.forEach((legend, index) => {
                stackedChartData.push({
                    xName: 'x',
                    yName: 'y',
                    type: chartSeriesType,
                    width: '2',
                    marker: { visible: true, width: 10, height: 10 },
                    name: legend,
                    dataSource: data?.map((obj) => obj[mapping.legends.key] === legend && ({
                        ["x"]: obj[mapping.stackedXYValues.stackedX],
                        ["y"]: obj[filter],
                    })).filter(Boolean).sort(function (a, b) {
                        return parseFloat(a[mapping.stackedXYValues.stackedX]) - parseFloat(b[mapping.stackedXYValues.stackedX]);
                    })
                })
            })
        }
        return stackedChartData
    }


    function getMinY(data, filter) {
        return data?.reduce((min, p) => p?.[filter] < min ? p?.[filter] : min, data[0]?.[filter]);
    }
    function getMaxY(data, filter) {
        return data?.reduce((max, p) => p?.[filter] > max ? p?.[filter] : max, data[0]?.[filter]);
    }

    const getAxisConfig = (data, axisConfig, filter) => {
        let min = getMinY(data, filter);
        let max = getMaxY(data, filter);

        if (min !== undefined && max !== undefined) {


            axisConfig.minimum = min
            axisConfig.maximum = max
            axisConfig.interval = (max - min) / 3

        }
        return axisConfig

    }

    const getChart = (content, id, filter, style) => {
        const { groupData, config } = content
        let chartData

        switch (config.variant) {
            case "stacked-bar":
                chartData = stackedBarChartData(groupData, config, filter)
                return (<StackedBar key={`key-${filter}`} data={chartData} id={id} height={"250"} width={config.hasScroll ? "500" : "auto"} style={style} chartXAxis={config.chartXAxis} chartYAxis={getAxisConfig(groupData, config.chartYAxis, filter)} />)
            case "column":
                chartData = columnBarChartData(groupData, config, filter)
                return (<ColumnBar key={`key-${filter}`} data={chartData} id={id} height={"250"} width={config.hasScroll ? "500" : "auto"} style={style} chartXAxis={config.chartXAxis} chartYAxis={getAxisConfig(groupData, config.chartYAxis, filter)} />)
            case "bar":
                chartData = barChartData(groupData, config, filter)
                return (<Bar key={`key-${filter}`} data={chartData} id={id} height={"250"} width={config.hasScroll ? "500" : "auto"} style={style} chartXAxis={config.chartXAxis} chartYAxis={getAxisConfig(groupData, config.chartYAxis, filter)} />)
            case "line":
                chartData = lineChartData(groupData, config, filter)
                return (<LineChart key={`key-${filter}`} data={chartData} id={id} height={"250"} width={config.hasScroll ? "500" : "auto"} style={style} chartXAxis={config.chartXAxis} chartYAxis={getAxisConfig(groupData, config.chartYAxis, filter)} />)
            case "pie":
                chartData = lineChartData(groupData, config, filter)
                return (<PieChart key={`key-${filter}`} data={chartData} id={id} legendVisiblity height="full" style={style} chartXAxis={config.chartXAxis} chartYAxis={getAxisConfig(groupData, config.chartYAxis, filter)} />)
            default:
                break;
        }
    }


    return (
        <>
            <Collapse show={hasCollapse} isCollapsed={isCollapsed} collapseComponent={<Header
                show={hasCollapse}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                title={`${content.config.chartTitle} - ${chartControls?.lob}` || ""}
                collapseButton={<button
                    className="collapse-button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <BsChevronDoubleRight /> : <BsChevronDoubleDown />}
                </button>}
                showFilters={showFilters}
                filtersComponent={<FilterComponent filters={filters} onChange={(val) => setControls(val)} style={filters?.style} />}
                {...props}

                />} >
                <div className="w-full chartWrapper" style={(content.config.hasScroll) ? { overflowX: 'scroll' } : {}}>
                    {content && getChart(content, id, chartControls?.lob, content.config.hasScroll ? { overflowX: 'scroll' } : {})}
                </div>
            </Collapse>
        </>
    )
};

export default ChartsComponent;
