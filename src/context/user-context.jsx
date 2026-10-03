import React from "react";

export const UserContext = React.createContext({
  user: null,
  setUser: () => {},
});

export const useUserContext = () => React.useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);

  const contextValue = React.useMemo(
    () => ({ user, setUser }),
    [user, setUser]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
