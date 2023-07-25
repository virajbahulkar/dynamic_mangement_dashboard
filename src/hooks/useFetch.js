import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    
    useEffect(() => {
      if(!url) return;
  
      setIsFetching(true);
      axios.get(url)
        .then(response => setData(response.data))
        .catch(error => setError(error.response.data))
        .finally(() => setIsFetching(false));
    }, [url]);
  
    return { data, isFetching, error };
};
export default useFetch