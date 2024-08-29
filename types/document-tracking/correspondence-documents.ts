export interface CorrespondenceDocumentType {
    id: string;
    userId: string;
    no: string;
    from: string;
    date: string;
    encoder: string;
    subject: string;
    description: string;
    link: string;
    routeType:string;
    documentType:string;
    attachment: string;
    remarks: string;
  }

  //INCOMING ROUTE TYPES
  export interface DocumentIncomingRouteToType {
    doctrackDocumentIncomingRouteId: string;
    receiver: string;
    sender: string;
    createdAt: string;
  }
  
  export interface DocumentIncomingRouteStatusType {
    doctrackDocumentIncomingRouteId: string;
    status: string;
    createdAt: string;
  }
  
  export interface DocumentIncomingRouteType {
    id: string;
    userId: string;
    subject: string;
    purpose: string;
    remarks: string;
    documentId: string;
    updatedAt: string;
    createdAt: string;
    doctrackDocumentIncomingRouteTo: DocumentIncomingRouteToType[];
    doctrackDocumentIncomingRouteStatus: DocumentIncomingRouteStatusType[];
  }



 
  
  
 