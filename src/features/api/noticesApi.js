import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {BASE_URL} from '../../utils/api';

export const noticesApi = createApi({
  reducerPath: "noticesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/notices`,
  }),
  tagTypes: ["Notice"],
  endpoints: (builder) => ({
    createNotice: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Notice"],
    }),

    getAllNotices: builder.query({
      query: (status) => (status ? `/?status=${status}` : "/"),
      providesTags: ["Notice"],
    }),

    updateNoticeStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Notice"],
    }),

    getSingleNotice: builder.query({
      query: (id) => `/${id}`,
    }),
  }),
});

export const {
  useCreateNoticeMutation,
  useGetAllNoticesQuery,
  useUpdateNoticeStatusMutation,
  useGetSingleNoticeQuery,
} = noticesApi;
