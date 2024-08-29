'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CorrespondenceDocumentType } from '@/types/document-tracking/correspondence-documents';
import { fetchDoctrackDocumentsData } from './documentAction';

interface DocumentState {
  documentsData: CorrespondenceDocumentType[];
  documentLoading: boolean;
  documentError: string | null;
}

const initialState: DocumentState = {
  documentsData: [],
  documentLoading: false,
  documentError: null,
};

const DocumentSlice = createSlice({
  name: 'document-tracking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctrackDocumentsData.pending, (state) => {
        state.documentLoading = true;
        state.documentError = null;
      })
      .addCase(fetchDoctrackDocumentsData.fulfilled, (state, action: PayloadAction<CorrespondenceDocumentType[]>) => {
        state.documentsData = action.payload;
        state.documentLoading = false;
      })
      .addCase(fetchDoctrackDocumentsData.rejected, (state) => {
        state.documentLoading = false;
        state.documentError = 'Failed to load document tracking documents';
      });
  },
});

export default DocumentSlice.reducer;

