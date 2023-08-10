// useAxios hook

import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://my-json-server.typicode.com/virajbahulkar/dynamic_mangement_dashboard';

const useAxios = (arr) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const generateConfig = (headers) => {
        const config = {
            
            headers: headers
        };
          

        return config
    }

    const fetchData = () => {
        let responseObj = []
        arr?.map((api) => {
            const { url, key = "", method = 'get', body = null, headers = null } = api || {}
            const config = generateConfig(headers)
            axios[method](`${axios.defaults.baseURL}${url}`, body, config)
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