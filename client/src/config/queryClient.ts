import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Number of retries for failed queries
      refetchOnWindowFocus: false, // Avoid refetching when the window regains focus
      // staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    },
    mutations: {
      retry: 1, // Number of retries for failed mutations
      onError: (error) => {
        console.error("Mutation Error:", error); // Centralized error logging
      },
    },
  },
});

export default queryClient;
