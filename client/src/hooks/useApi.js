// client/src/hooks/useApi.js
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunc(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
    setData,
  };
};

// Hook with automatic error toast
export const useApiWithToast = (apiFunc, options = {}) => {
  const {
    successMessage,
    errorMessage,
    showSuccessToast = false,
    showErrorToast = true,
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunc(...args);
        setData(response.data);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        return response.data;
      } catch (err) {
        const errMsg =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(errMsg);

        if (showErrorToast) {
          toast.error(errorMessage || errMsg);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, successMessage, errorMessage, showSuccessToast, showErrorToast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
    setData,
  };
};

// Hook for paginated data
export const usePaginatedApi = (apiFunc) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const execute = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunc({ ...params, page: 1 });

        setData(
          response.data.questions ||
            response.data.users ||
            response.data.data ||
            []
        );
        setPagination({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || 0,
          hasMore:
            (response.data.currentPage || 1) < (response.data.totalPages || 1),
        });

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const loadMore = useCallback(
    async (params = {}) => {
      if (!pagination.hasMore || loadingMore) return;

      try {
        setLoadingMore(true);
        const nextPage = pagination.currentPage + 1;
        const response = await apiFunc({ ...params, page: nextPage });

        const newData =
          response.data.questions ||
          response.data.users ||
          response.data.data ||
          [];
        setData((prev) => [...prev, ...newData]);
        setPagination({
          currentPage: response.data.currentPage || nextPage,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || 0,
          hasMore:
            (response.data.currentPage || nextPage) <
            (response.data.totalPages || 1),
        });

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(errorMessage);
        throw err;
      } finally {
        setLoadingMore(false);
      }
    },
    [apiFunc, pagination, loadingMore]
  );

  const reset = useCallback(() => {
    setData([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasMore: false,
    });
    setError(null);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  const refresh = useCallback(
    async (params = {}) => {
      reset();
      return execute(params);
    },
    [reset, execute]
  );

  return {
    data,
    pagination,
    error,
    loading,
    loadingMore,
    execute,
    loadMore,
    reset,
    refresh,
    setData,
  };
};

// Hook for mutations (create, update, delete)
export const useMutation = (apiFunc, options = {}) => {
  const { onSuccess, onError, successMessage, errorMessage } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunc(...args);
        setData(response.data);

        if (successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        const errMsg =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(errMsg);

        toast.error(errorMessage || errMsg);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, onSuccess, onError, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    mutate,
    reset,
    isLoading: loading,
    isError: !!error,
    isSuccess: !!data && !error,
  };
};

export default useApi;
