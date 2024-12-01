import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const loadUserData = () => {
    const savedUserData = Cookies.get('user');
    const savedToken = Cookies.get('authToken');
    
    if (savedUserData && savedToken) {
      try {
        return { ...JSON.parse(savedUserData), authToken: savedToken };
      } catch (e) {
        Cookies.remove('user');
        Cookies.remove('authToken');
        return getDefaultUser();
      }
    }
    return getDefaultUser();
  };

  const getDefaultUser = () => ({
    username: '',
    email: '',
    password: '',
    rooms: [],
    devices: [],
    activitylog: [],
  });

  const [user, setUser] = useState(loadUserData);

  useEffect(() => {
    if (user && user.authToken) {
      Cookies.set('user', JSON.stringify({
        username: user.username,
        email: user.email,
        rooms: user.rooms,
        devices: user.devices,
        activitylog: user.activitylog,
      }), { expires: 7 });

      Cookies.set('authToken', user.authToken, { expires: 7 });
    }
  }, [user]);

  const logActivity = (action) => {
    setUser((prev) => ({
      ...prev,
      activitylog: [...prev.activitylog, action],
    }));
  };

  const logout = () => {
    setUser(getDefaultUser());
    Cookies.remove('user');
    Cookies.remove('authToken');
  };

  const newDevice = (device) => {
    setUser((prev) => ({
      ...prev,
      devices: [...prev.devices, device],
    }));
  };

  const newRoom = (room) => {
    setUser((prev) => ({
      ...prev,
      rooms: [...prev.rooms, room],
    }));
  };

  const removeDevice = (deviceId) => {
    setUser((prev) => ({
      ...prev,
      devices: prev.devices.filter(device => device.deviceid !== deviceId),
    }));
  };

  const updateDevice = (deviceId, updatedDevice) => {
    setUser((prev) => ({
      ...prev,
      devices: prev.devices.map((device) =>
        device.deviceid === deviceId ? { ...device, ...updatedDevice } : device
      ),
    }));
  };

  const authenticateUser = (token, userData) => {
    setUser({ ...userData, authToken: token });
    Cookies.set('authToken', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
  };

  return (
    <UserContext.Provider value={{ user, setUser, authenticateUser, logout, newDevice, newRoom, removeDevice, updateDevice, logActivity }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
