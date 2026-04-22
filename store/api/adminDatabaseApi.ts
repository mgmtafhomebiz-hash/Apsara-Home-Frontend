import { baseApi } from './baseApi'

export interface DatabaseExportItem {
  path: string
  name: string
  download_name?: string
  size_bytes: number
  last_modified_at?: string
  generated_at?: string
  table_count?: number
  total_rows?: number
  preview_table?: string
  preview_csv?: string
}

export interface ListDatabaseExportsResponse {
  exports: DatabaseExportItem[]
}

export interface ExportDatabaseResponse {
  message: string
  export: DatabaseExportItem
}

export interface DownloadDatabaseExportPayload {
  path: string
  download_name?: string
}

export const adminDatabaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDatabaseExports: builder.query<ListDatabaseExportsResponse, void>({
      query: () => ({
        url: '/api/admin/web-pages/database/exports',
        method: 'GET',
      }),
    }),
    exportDatabase: builder.mutation<ExportDatabaseResponse, void>({
      query: () => ({
        url: '/api/admin/web-pages/database/exports',
        method: 'POST',
      }),
    }),
    downloadDatabaseExport: builder.mutation<Blob, DownloadDatabaseExportPayload>({
      query: (body) => ({
        url: '/api/admin/web-pages/database/exports/download',
        method: 'POST',
        body,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
})

export const {
  useListDatabaseExportsQuery,
  useExportDatabaseMutation,
  useDownloadDatabaseExportMutation,
} = adminDatabaseApi
