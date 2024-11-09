import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    rooms: [],
    devices: [],
  });

  const logout = () => setUser(null);

  const addDevice = (device) => {
    setUser((prevUser) => ({
      ...prevUser,
      devices: [...prevUser.devices, device],
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, addDevice }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
