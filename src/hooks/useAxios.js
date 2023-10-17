// useAxios hook

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useCallback } from 'react';

axios.defaults.baseURL = 'http://ec2-43-204-91-209.ap-south-1.compute.amazonaws.com:9000/api';

const useAxios = ({ apis, filtersForBody }) => {
    const [response, setResponse] = useState([]);
    const [token, setToken] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);
    const [cancelToken, setCancelToken] = useState(null);

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

    const generateToken = (api) => {

        const { url, method, body, headers } = api || {}
        const config = generateConfig(headers)
        axios[method](`${axios.defaults.baseURL}${url}`, body, config)
            .then((res) => {
                if (res.data.access_token) {
                    setToken(`Bearer ${res.data.access_token}`)
                }
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });

    };

    const fetchData = (token, apis) => {
        let responseObj = []
        apis?.map((api) => {
            let { url, key = "", method = 'get', body = null, headers = {} } = api || {}
            body = filtersForBody ?? undefined
            const config = generateConfig(headers, token)
            let axiosFunc
           
            if(method === 'post') {
                axiosFunc = axios[method](`${axios.defaults.baseURL}${url}`, body, config, {
                    cancelToken: cancelToken
                })
            } else {
                axiosFunc = axios[method](`${axios.defaults.baseURL}${url}`, config, {
                    cancelToken: cancelToken
                })
            }

            
            axiosFunc.then((res) => {
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
        })

    };

    useMemo(() => {
        if (cancelToken) {
            cancelToken.cancel('Operation canceled by the user.');
        }
        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken);

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
        })

        return () => {
            if (newCancelToken) {
                newCancelToken.cancel('Component unmounted.');
            }
        };

    }, []);

    useEffect(() => {
        if (token && apis) {
            fetchData(token, apis)
        }
    }, [token, apis])

    return { response, error, loading };
};

export default useAxios;