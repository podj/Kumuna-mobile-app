import React, { createContext, useState } from "react";

export const KumunaContext = createContext();

export const KumunaProvider = ({ children }) => {
  const [kumunaMembers, setKumunaMembers] = useState(null);

  return (
    <KumunaContext.Provider
      value={{
        kumunaMembers,
        setKumunaMembers,
      }}>
      {children}
    </KumunaContext.Provider>
  );
};
