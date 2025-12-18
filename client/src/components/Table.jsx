// ...existing code...
import React, { useState } from 'react';
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
import useDataSource from '../hooks/useDataSource';
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
  } = props || {};
  const { tableData } = content || {};
  const fallbackData = React.useMemo(() => ({
    headings: tableData?.headings || [{ field: 'name', headerText: 'Name' }, { field: 'value', headerText: 'Value' }],
    data: tableData?.data || [{ name: 'Sample', value: 1 }, { name: 'Example', value: 2 }]
  }), [tableData]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [setControls] = useState();
  const { currentColor } = useStateContext();

  // NOTE: Temporary migration – original dynamic child grid pulled remote data.
  // Simplify: use first api descriptor if present (future: multiple merged sources)
  const primaryApi = apis && apis[0] ? apis[0] : null;
  const descriptor = primaryApi
    ? {
        transport: 'rest',
        method: (primaryApi.method || 'get').toLowerCase(),
        url: primaryApi.url,
        baseUrl: process.env.REACT_APP_API_BASE || '',
        body: primaryApi.body,
        headers: primaryApi.headers,
        transform: [],
      }
    : null;
  const { data: apiData } = useDataSource(descriptor);

  

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
      <div style={{ width: '100%' }}>
      <GridComponent
        selectionSettings={selectionsettings}
        childGrid={getChildGrid(childGridConfig, apiData)}
        dataSource={fallbackData.data}
        id={`Table${id}`}
        width="100%"
        height={Math.max(120, (fallbackData.data?.length || 0) * 32 + 56)}
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
          {/* Spread operator is used intentionally for dynamic column props */}
          {(fallbackData.headings || []).map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Search, Page, Toolbar, DetailRow]} />
      </GridComponent>
      </div>
    </Collapse>
  );
};
export default Table;
