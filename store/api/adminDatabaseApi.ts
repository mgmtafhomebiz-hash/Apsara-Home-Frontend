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
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

export interface ExportDatabaseResponse {
  message: string
  export: DatabaseExportItem
}

export interface DownloadDatabaseExportPayload {
  path: string
  download_name?: string
}

export interface DeleteDatabaseExportPayload {
  path: string
}

export interface DeleteDatabaseExportResponse {
  message: string
}

export const adminDatabaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDatabaseExports: builder.query<ListDatabaseExportsResponse, { page?: number; per_page?: number } | void>({
      query: (params) => ({
        url: '/api/admin/web-pages/database/exports',
        method: 'GET',
        params,
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
    deleteDatabaseExport: builder.mutation<DeleteDatabaseExportResponse, DeleteDatabaseExportPayload>({
      query: (body) => ({
        url: '/api/admin/web-pages/database/exports',
        method: 'DELETE',
        body,
      }),
    }),
  }),
})

export const {
  useListDatabaseExportsQuery,
  useExportDatabaseMutation,
  useDownloadDatabaseExportMutation,
  useDeleteDatabaseExportMutation,
} = adminDatabaseApi
