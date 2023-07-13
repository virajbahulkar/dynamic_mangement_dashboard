import React from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page, Toolbar } from '@syncfusion/ej2-react-grids';

import { employeesData, employeesGrid } from '../data/dummy';
import { Header } from '../components';


const Table = (props) => {
  const toolbarOptions = ['Search'];

  const { content, id } = props
  
  console.log("content", content)

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
    <div className="m-2  bg-white rounded-3xl">
      <Header  title="Channel Performance" />
      <GridComponent
        dataSource={content.data}
        id={`Table${id}`}
        width="auto"
        allowPaging={true}
        allowSorting={true}
        allowFiltering={true}
        height={200}
        toolbar={toolbarOptions}
        load={onLoad}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {content.headings.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page, Toolbar]} />

      </GridComponent>
    </div>
  );
};
export default Table;
