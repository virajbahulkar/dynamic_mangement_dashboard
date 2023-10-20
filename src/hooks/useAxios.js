/* eslint-disable no-console */
// useAxios hook

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = 'http://ec2-43-204-91-209.ap-south-1.compute.amazonaws.com:9000/api';

const useAxios = ({ apis, filtersForBody }) => {
  const [response, setResponse] = useState([]);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);
  const [cancelToken, setCancelToken] = useState(null);

  const generateConfig = (headers, accessToken) => {
    const config = {
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        Authorization: accessToken || '',
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    return config;
  };

  const generateToken = (api) => {
    const { url, method, body, headers } = api || {};
    const bodyObj = qs.stringify(body);
    const config = generateConfig(headers);
    axios[method](`${axios.defaults.baseURL}${url}`, bodyObj, config)
      .then((res) => {
        if (res.data.access_token) {
          setToken(`Bearer ${res.data.access_token}`);
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  const fetchData = (accessToken, arrayOfApis) => {
    const responseObj = [];
    // eslint-disable-next-line array-callback-return
    arrayOfApis?.map((api) => {
      const { url, method = 'get', headers = {} } = api || {};
      const bodyObj = filtersForBody ?? undefined;
      const config = generateConfig(headers, accessToken);
      let axiosFunc;

      if (method === 'post') {
        axiosFunc = axios[method](`${axios.defaults.baseURL}${url}`, bodyObj, config, {
          cancelToken,
        });
      } else {
        axiosFunc = axios[method](`${axios.defaults.baseURL}${url}`, config, {
          cancelToken,
        });
      }

      axiosFunc
        .then((res) => {
          responseObj.push(res.data);
        })
        .then(() => {
          setResponse(responseObj);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.error('Request canceled:', err.message);
          } else {
            console.error('An error occurred:', err.message);
          }
          setError(err);
        })
        .finally(() => {
          setloading(false);
        });
    });
  };

  useMemo(() => {
    if (cancelToken) {
      cancelToken.cancel('Operation canceled by the user.');
    }
    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);

    generateToken({
      url: '/auth/login/',
      key: 'auth',
      method: 'post',
      body: {
        username: 'saral',
        password: 'saral',
      },
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return () => {
      if (newCancelToken) {
        newCancelToken.cancel('Component unmounted.');
      }
    };
  }, []);

  useEffect(() => {
    if (token && apis) {
      fetchData(token, apis);
    }
  }, [token, apis]);

  return { response, error, loading };
};

export default useAxios;
