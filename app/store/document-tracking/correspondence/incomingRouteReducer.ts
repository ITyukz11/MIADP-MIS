'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentIncomingRouteType } from '@/types/document-tracking/correspondence-documents';
import { fetchDoctrackDocumentIncomingRoutesData } from './incomingRouteAction';

interface DocumentIncomingRouteState {
  documentsIncomingRouteData: DocumentIncomingRouteType[];
  documentIncomingRouteLoading: boolean;
  documentIncomingRouteError: string | null;
}

const initialState: DocumentIncomingRouteState = {
  documentsIncomingRouteData: [],
  documentIncomingRouteLoading: false,
  documentIncomingRouteError: null,
};

const DocumentIncomingRouteSlice = createSlice({
  name: 'document-incoming-routes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctrackDocumentIncomingRoutesData.pending, (state) => {
        state.documentIncomingRouteLoading = true;
        state.documentIncomingRouteError = null;
      })
      .addCase(fetchDoctrackDocumentIncomingRoutesData.fulfilled, (state, action: PayloadAction<DocumentIncomingRouteType[]>) => {
        state.documentsIncomingRouteData = action.payload;
        state.documentIncomingRouteLoading = false;
      })
      .addCase(fetchDoctrackDocumentIncomingRoutesData.rejected, (state) => {
        state.documentIncomingRouteLoading = false;
        state.documentIncomingRouteError = 'Failed to load Doctrack Document Incoming Routes Data';
      });
  },
});

export default DocumentIncomingRouteSlice.reducer;

