import React, { useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, DetailRow, Search, Page, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header } from '.';
import Collapse from './Collapse/Collapse';
import FilterComponent from './FilterComponent';
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';
import { generateClasses } from '../helpers';
import axios from 'axios';
const
  Table = (props) => {
    const toolbarOptions = ['Search'];
    const selectionsettings = { mode: 'Cell' };
    const { content, id, hasCollapse, showFilters, filters, childGridConfig } = props
    const { tableData, tableChildData } = content
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [response, setResponse] = useState(false);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(false);
    const [controls, setControls] = useState()

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

    const generateConfig = (headers, token) => {

      const config = {
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
          'Authorization': token ? token : '',
          ...headers
        }
      };
      return config
    }

    const generateToken = (api, { channel }) => {
      const { url, method, body, headers } = api || {}
      const config = generateConfig(headers)
      axios[method](`${axios.defaults.baseURL}${url}`, body, config)
        .then((res) => {
          if (res.data.access_token) {

            fetchData(`Bearer ${res.data.access_token}`, { channel })
          }
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setloading(false);
        });

    };

    const fetchData = (token, { channel }) => {
      const api = getAPiUrlFromConfig(childGridConfig)
      let responseObj = []
      const { url, key = "", method = 'get', body = null, headers = {} } = api || {}
      const config = generateConfig(headers, token)
      axios[method](`${axios.defaults.baseURL}${url}`, { channel, ...body }, config)
        .then((res) => {

          responseObj.push(res.data)
        }).then(() => {

          setResponse(responseObj)
        })
        .catch((err) => {

          if (axios.isCancel(err)) {
            console.log('Request canceled:', err.message);
          } else {
            console.log('An error occurred:', err.message);
          }
          setError(err);
        })
        .finally(() => {
          setloading(false);

        });
    };

    const setApiUrl = ({ channel }) => {
      generateToken({
        url: '/auth/login/',
        key: "auth",
        method: 'post',
        body: {
          "username": "saral",
          "password": "saral"
        },
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
      }, { channel })
    }

    const getTableData = (template, data) => {
      const { headings } = template || {}
      return { headings, data }
    }

    const getChildGrid = (template, data) => {
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

    }

    function selectingEvents(e) {
      setApiUrl({
        channel: e.data.channel
      })
    }

    return (
      <>
        <Collapse show={hasCollapse}
          collapseComponent={<Header
            show={hasCollapse} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}
            collapseButton={<button
              className="collapse-button"
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
            childGrid={response ? getChildGrid(childGridConfig, response[0]) : []}
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
