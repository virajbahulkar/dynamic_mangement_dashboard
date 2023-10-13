import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, DetailRow, Search, Page, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header } from '.';
import Collapse from './Collapse/Collapse';
import FilterComponent from './FilterComponent';
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';
import { generateClasses } from '../helpers';
import { useStateContext } from '../contexts/ContextProvider';
import useAxios from '../hooks/useAxios';
const
  Table = (props) => {
    const toolbarOptions = ['Search'];
    const selectionsettings = { mode: 'Cell' };
    const { content, id, hasCollapse, showFilters, filters, childGridConfig, headerCollapseButtonConfig, filtersBasedOn } = props
    const { tableData, tableChildData } = content
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [controls, setControls] = useState()
    const { currentColor } = useStateContext()
    const [apis, setApis] = useState([]);
    const [childApiBasedOnParam, setChildApiBasedOnParam] = useState("");
    const [filtersForBody, setFiltersForBody] = useState({});

    const { response, error, loading } = useAxios(apis ? { apis, filtersForBody } : [])

    const onLoad = () => {
      let gridElement = document.getElementById(id);
      if (gridElement && gridElement.ej2_instances[0]) {
        let gridInstance = gridElement.ej2_instances[0];
        /** height of the each row */
        const rowHeight = gridInstance.getRowHeight();
        /** Grid height */
        const gridHeight = gridInstance.height;
        /** initial page size */
        const pageSize = gridInstance.pageSettings.pageSize;
        /** new page size is obtained here */
        const pageResize = (gridHeight - (pageSize * rowHeight)) / rowHeight;
        gridInstance.pageSettings.pageSize = pageSize + Math.round(pageResize);
      }
    };

    const getAPiUrlFromConfig = (config) => {
      if (config?.dataType && config?.apiKey) {
        let data = {
          "flag": "ISSUANCE",
          "dim_dt": "YTD",
          "yoy": "2023"
        }
        const obj = {
          url: config?.apiKey,
          key: config?.dataType,
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }
        return obj
      }
    }

    const setApiUrl = () => {
      const urlObj = getAPiUrlFromConfig(childGridConfig)
      setApis(Array.apply(null, Array(urlObj)))
    }

    const getTableData = (template, data) => {
      const { headings } = template || {}
      return { headings, data }
    }

    const getChildGrid = (template, data) => {
      if (!template) {
        return undefined
      }
      if (template && data) {
        let tableData = getTableData(template, data?.[template?.dataKey])
        if (tableData) {
          return {
            dataSource: tableData?.data,
            columns: template?.headings,
            queryString: 'channel',
            rowHeight: 30,
            columnHeight: 30,
            type: 'border',
            gridLines: 'Both'
          }
        }
      } else {
        return []
      }
    }

    useEffect(() => {
      if(childApiBasedOnParam) {
        setFiltersForBody({channel: childApiBasedOnParam, ...filtersBasedOn})
        setApiUrl()
      }
      
    }, [childApiBasedOnParam])
    

    function selectingEvents(e) {
      setChildApiBasedOnParam(e.data.channel)
      
    }

    return (
      <>
        <Collapse show={hasCollapse}
          collapseComponent={<Header
            show={hasCollapse} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}
            collapseButton={<button
              className="collapse-button"
              style={{ color: headerCollapseButtonConfig?.color === 'themeColor' ? currentColor : headerCollapseButtonConfig?.color }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <BsChevronDoubleRight /> : <BsChevronDoubleDown />}
            </button>}
            showFilters={showFilters}
            filtersComponent={<FilterComponent filters={filters} onChange={(val) => setControls(val)} className={`${generateClasses(filters?.style)} position-absolute`} />}
            {...props} />} isCollapsed={isCollapsed}>
          <GridComponent
            selectionSettings={selectionsettings}
            detailDataBound={selectingEvents}
            childGrid={getChildGrid(childGridConfig, response[0])}
            dataSource={tableData?.data}
            id={`Table${id}`}
            width="auto"
            allowPaging={false}
            rowHeight={30}
            columnHeight={30}
            type='border'
            gridLines='Both'
            allowSorting={true}
            allowFiltering={false}
            pageSettings={{ pageSize: '4' }}
            load={onLoad}
          >
            <ColumnsDirective >
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              {tableData?.headings?.map((item, index) => <ColumnDirective key={index} {...item} />)}
            </ColumnsDirective>
            <Inject services={[Search, Page, Toolbar, DetailRow]} />

          </GridComponent>
        </Collapse>
      </>
    );
  };
export default Table;
