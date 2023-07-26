// useAxios hook

import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

const useAxios = (arr) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const fetchData = () => {
        let responseObj = []
        arr?.map((api) => {
            const { url, key = "", method = 'get', body = null, headers = null } = api || {}
            axios[method](`${axios.defaults.baseURL}${url}`, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                responseObj.push({[key]: res.data})
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
        })
        setResponse(responseObj);
    };

    useEffect(() => {
        fetchData();
    }, [arr]);

    return { response, error, loading };
};

export default useAxios;