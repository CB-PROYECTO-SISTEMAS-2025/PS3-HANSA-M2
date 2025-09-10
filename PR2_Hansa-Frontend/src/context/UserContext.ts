// src/context/UserContext.ts

import { createContext } from "react";

export interface User {
  username: string;
  // Otros campos si es necesario
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);