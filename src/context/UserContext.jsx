import { useContext, createContext } from "react";
import { useUser } from "../hooks/useUser";

const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const { data, isLoading, isError } = useUser();

  const user = !isLoading && !isError ? data : null;
  

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
