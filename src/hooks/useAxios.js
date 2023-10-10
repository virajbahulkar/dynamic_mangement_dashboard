// useAxios hook

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';

axios.defaults.baseURL = 'http://ec2-43-204-91-209.ap-south-1.compute.amazonaws.com:9000/api';

const useAxios = ({apis, filters}) => {
    console.log("arr", apis)
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
                'Authorization': token ? token: '',
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
          if(res.data.access_token) {
            fetchData(`Bearer ${res.data.access_token}`)
          }
        })
        .catch((err) => {
            setError(err);
        })
        .finally(() => {
            setloading(false);
        });
        
    };

    const fetchData = (token, cancelToken) => {
        let responseObj = []
        apis?.map((api) => {
            const { url, key = "", method = 'get', body = null, headers = {} } = api || {}
            const config = generateConfig(headers, token)
            axios[method](`${axios.defaults.baseURL}${url}`, body, config, {
                cancelToken: cancelToken
              })
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
        })
    };

    useEffect(() => {
        if (cancelToken) {
            cancelToken.cancel('Operation canceled by the user.');
        }
        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken);

        if(filters) {
            generateToken({ 
                url: '/auth/login/', 
                key: "auth", 
                method: 'post', 
                body: {
                    "username":"saral",
                    "password":"saral"
                }, 
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                } 
            })
        }
        
    }, [filters]);

    return { response, error, loading };
};

export default useAxios;