import React, { useState, useEffect } from "react";
import * as Context from "./UserContext";
 
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Context.User | null>(null);
 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
 
  return (
    <Context.UserContext.Provider value={{ user, setUser }}>
      {children}
    </Context.UserContext.Provider>
  );
};