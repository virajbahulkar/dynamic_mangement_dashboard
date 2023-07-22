import React, { useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header } from '.';
import Collapse from './Collapse/Collapse';

const Table = (props) => {
  const toolbarOptions = ['Search'];

  const { content, id, hasCollapse } = props
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <>
      <Collapse show={hasCollapse} collapseComponent={ <Header  show={hasCollapse} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} {...props}  />} isCollapsed={isCollapsed}>  
        <GridComponent
          dataSource={content.data}
          id={`Table${id}`}
          width="auto"
          allowPaging={true}
          type='border'
          gridLines='Both'
          allowSorting={true}
          allowFiltering={true}
          pageSettings={{ pageSize: '4' }}
          toolbar={toolbarOptions}
          load={onLoad}
        >
          <ColumnsDirective>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {content.headings.map((item, index) => <ColumnDirective key={index} {...item} />)}
          </ColumnsDirective>
          <Inject services={[Search, Page, Toolbar]} />

        </GridComponent>              
      </Collapse>
    </>
  );
};
export default Table;
