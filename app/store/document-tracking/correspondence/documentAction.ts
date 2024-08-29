'use client'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDocumentsData } from '@/lib/document-tracking/fetch-documents';
import { CorrespondenceDocumentType } from '@/types/document-tracking/correspondence-documents';

export const fetchDoctrackDocumentsData = createAsyncThunk<CorrespondenceDocumentType[]>(
  'document-tracking/fetchDoctrackDocumentsData',
  async () => {
    const response = await fetchDocumentsData();
    return response;
  }
);
