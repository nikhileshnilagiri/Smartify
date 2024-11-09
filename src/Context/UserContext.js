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
    setUser((prev) => ({
      ...prev,
      devices: [...prev.devices, device],
    }));
  };

  const newroom = (room) => {
    setUser((prev) => ({...prev,rooms:[...prev.rooms,room]}))
  }; 

  return (
    <UserContext.Provider value={{ user, setUser, logout, addDevice, newroom }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
