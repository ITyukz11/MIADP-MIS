// 'use client'
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { fetchAllUsers } from '@/lib/admin/users';

// // Define the User type
// export type User = {
//   id: string;
//   region: string;
//   name: string;
//   unit: string;
//   component: string;
//   position: string;
//   email: string;
//   color: string;
//   expoPushToken?: string | null;
//   notification?: any | null;
//   status: string;
//   createdAt: Date;
//   updatedAt: Date;
//   role: string;
//   participants: any[];
// };

// // Define the context state type
// type UsersContextState = {
//   usersData: User[];
//   loadingUser: boolean;
//   errorUser: Error | null;
//   fetchUsers: () => Promise<void>;
// };

// // Create the context with an undefined default value
// const UsersContext = createContext<UsersContextState | undefined>(undefined);

// interface UsersProviderProps {
//   children: ReactNode;
// }

// // Create the provider component
// export const UsersProvider = ({ children }: UsersProviderProps) => {
//   const [usersData, setUsers] = useState<User[]>([]);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [errorUser, setErrorUser] = useState<Error | null>(null);

//   const fetchUsers = async () => {
//     setLoadingUser(true);
//     try {
//       const data = await fetchAllUsers();
//       setUsers(data);
//       setLoadingUser(false);
//     } catch (err) {
//       setErrorUser(err as Error);
//       setLoadingUser(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <UsersContext.Provider value={{ usersData, loadingUser, errorUser, fetchUsers }}>
//       {children}
//     </UsersContext.Provider>
//   );
// };

// // Custom hook to use the UsersContext
// export const useUsers = (): UsersContextState => {
//   const context = useContext(UsersContext);
//   if (context === undefined) {
//     throw new Error('useUsers must be used within a UsersProvider');
//   }
//   return context;
// };
