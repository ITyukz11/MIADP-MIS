'use client'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentIncomingRouteType } from '@/types/document-tracking/correspondence-documents';
import { fetchDocumentIncomingRoutes } from '@/lib/document-tracking/fetch-incoming-routes';

export const fetchDoctrackDocumentIncomingRoutesData = createAsyncThunk<DocumentIncomingRouteType[]>(
  'document-tracking/fetchDoctrackDocumentIncomingRoutesData',
  async () => {
    const response = await fetchDocumentIncomingRoutes();
    return response;
  }
);
