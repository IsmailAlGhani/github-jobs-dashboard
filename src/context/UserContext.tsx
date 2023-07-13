import { useState, createContext, useContext, FC } from "react";
import { ChildProps } from "../Util";
type UserContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext({} as UserContextType);

export const UserProvider: FC<ChildProps> = ({ children }) => {
  const [userId, setUserId] = useState<string>("");

  return (
    <AppContext.Provider value={{ userId, setUserId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = (): UserContextType => {
  return useContext(AppContext);
};
