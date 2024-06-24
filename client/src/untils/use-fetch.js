import { useCallback, useState } from 'react';

import URL from './url';

// hooks lấy dữ liệu từ API
const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUrl = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL.BASE + requestConfig.url, {
        method: requestConfig.method, // *GET, POST, PUT, DELETE, etc.
        mode: requestConfig.mode, // no-cors, *cors, same-origin
        cache: requestConfig.cache, // *default, no-cache, reload, force-cache, only-if-cached
        credentials: requestConfig.credentials, // include, *same-origin, omit
        headers: requestConfig.headers,
        // {
        //   *'Content-Type': 'application/json',
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // },
        redirect: requestConfig.redirect, // manual, *follow, error
        referrerPolicy: requestConfig.referrerPolicy, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: requestConfig.body,
      });

      // if (!response.ok) {
      //   throw new Error('Request failed!');
      // }

      const data = await response.json();
      applyData(data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    fetchUrl,
  };
};

export default useFetch;
