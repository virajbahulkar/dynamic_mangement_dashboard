/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  DetailRow,
  Search,
  Page,
  Toolbar,
} from '@syncfusion/ej2-react-grids';
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';
import { getValue } from '@syncfusion/ej2-base';
import Collapse from './Collapse/Collapse';
import FilterComponent from './FilterComponent';
import { generateClasses } from '../helpers';
import { useStateContext } from '../contexts/ContextProvider';
import useAxios from '../hooks/useAxios';
import Header from './Header';

const Table = (props) => {
  const selectionsettings = { mode: 'Cell' };
  const {
    content,
    id,
    hasCollapse,
    showFilters,
    filters,
    childGridConfig,
    headerCollapseButtonConfig,
    filtersBasedOn,
  } = props || {};
  const { tableData } = content || {};
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [setControls] = useState();
  const { currentColor } = useStateContext();
  const [apis, setApis] = useState([]);
  const [childApiBasedOnParam, setChildApiBasedOnParam] = useState('');
  const [filtersForBody, setFiltersForBody] = useState({});

  const { response, error, loading } = useAxios(apis ? { apis, filtersForBody } : []);

  const getAPiUrlFromConfig = (config) => {
    let obj = {};
    if (config?.dataType && config?.apiKey) {
      const data = {
        flag: 'ISSUANCE',
        dim_dt: 'YTD',
        yoy: '2023',
      };
      obj = {
        url: config?.apiKey,
        key: config?.dataType,
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return obj;
  };

  const setApiUrl = () => {
    const urlObj = getAPiUrlFromConfig(childGridConfig);
    setApis(Array.apply(null, Array(urlObj)));
  };

  const rowDataBound = ({ row }) => {
    if (row) {
      if (getValue('channel', row.data) === 'Company') {
        row.row.bgColor = 'lightblue';
      }
    }
  };

  const getTableData = (template, data) => {
    const { headings } = template || {};
    return { headings, data };
  };

  const getChildGrid = (template, data) => {
    if (!template) {
      return undefined;
    }
    if (template && data) {
      const tableData = getTableData(template, data?.[template?.dataKey]);
      if (tableData) {
        return {
          dataSource: tableData?.data,
          columns: template?.headings,
          queryString: 'channel',
          allowPaging: true,
          pageSettings: { pageSize: '4' },
          rowHeight: 30,
          columnHeight: 30,
          type: 'border',
          gridLines: 'Both',
        };
      }
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (childApiBasedOnParam) {
      if (filtersBasedOn?.channel) {
        filtersBasedOn.channel = childApiBasedOnParam;
        setFiltersForBody(filtersBasedOn);
      } else {
        setFiltersForBody({ channel: childApiBasedOnParam, ...filtersBasedOn });
      }

      setApiUrl();
    }
  }, [childApiBasedOnParam]);

  const onLoad = () => {
    const gridElement = document.getElementById(id);
    if (gridElement && gridElement.ej2_instances[0]) {
      const gridInstance = gridElement.ej2_instances[0];
      /** height of the each row */
      const rowHeight = gridInstance.getRowHeight();
      /** Grid height */
      const gridHeight = gridInstance.height;
      /** initial page size */
      const { pageSize } = gridInstance.pageSettings;
      /** new page size is obtained here */
      const pageResize = (gridHeight - pageSize * rowHeight) / rowHeight;
      gridInstance.pageSettings.pageSize = pageSize + Math.round(pageResize);
    }
  };

  function selectingEvents(e) {
    setChildApiBasedOnParam(e.data.channel);
  }

  return (
    <Collapse
      show={hasCollapse}
      collapseComponent={
        <Header
          show={hasCollapse}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          collapseButton={
            <button
              type="button"
              className="collapse-button"
              style={{
                color:
                  headerCollapseButtonConfig?.color === 'themeColor'
                    ? currentColor
                    : headerCollapseButtonConfig?.color,
              }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <BsChevronDoubleRight /> : <BsChevronDoubleDown />}
            </button>
          }
          showFilters={showFilters}
          filtersComponent={
            <FilterComponent
              filters={filters}
              onChange={(val) => setControls(val)}
              className={`${generateClasses(filters?.style)} position-absolute`}
            />
          }
          {...props}
        />
      }
      isCollapsed={isCollapsed}
    >
      <GridComponent
        selectionSettings={selectionsettings}
        detailDataBound={selectingEvents}
        childGrid={getChildGrid(childGridConfig, response[0])}
        dataSource={tableData?.data}
        id={`Table${id}`}
        width="auto"
        allowPaging={false}
        pageSettings={{ pageSize: '4' }}
        rowDataBound={(row) => rowDataBound({ row })}
        rowHeight={30}
        columnHeight={30}
        type="border"
        gridLines="Both"
        allowSorting
        allowFiltering={false}
        load={onLoad}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {tableData?.headings?.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Search, Page, Toolbar, DetailRow]} />
      </GridComponent>
    </Collapse>
  );
};
export default Table;
