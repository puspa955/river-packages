import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DatasetFilter as OriginalDatasetFilter } from "./DatasetFilter";

const defaultQueryClient = new QueryClient();

export const DatasetFilter = (props) => (
  <QueryClientProvider client={defaultQueryClient}>
    <OriginalDatasetFilter {...props} />
  </QueryClientProvider>
);
