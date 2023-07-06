import React from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';

import { employeesData, employeesGrid } from '../data/dummy';
import { Header } from '../components';

const Table = (props) => {
  const toolbarOptions = ['Search'];

  const { content } = props

  const editing = { allowDeleting: true, allowEditing: true };

  return (
    <div className="m-2  bg-white rounded-3xl">
      <Header  title="Channel Performance" />
      <GridComponent
        dataSource={content.data}
        width="auto"
        allowPaging={false}
        allowSorting={false}
        pageSettings={{ pageCount: 5, pageSize: 6, pageSizes: true }}
        editSettings={editing}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {content.headings.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page]} />

      </GridComponent>
    </div>
  );
};
export default Table;
