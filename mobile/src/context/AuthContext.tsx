import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { loginRequest } from "../services/auth.service";
import { saveExpoPushTokenRequest } from "../services/notification.service";
import { getMyProfileRequest } from "../services/user.service";
import { User } from "../types/auth.types";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotifications";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const registerPushToken = async () => {
    try {
      const expoPushToken = await registerForPushNotificationsAsync();

      if (expoPushToken) {
        await saveExpoPushTokenRequest(expoPushToken);
      }
    } catch (error) {
      console.log("REGISTER PUSH TOKEN ERROR:", error);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          await registerPushToken();
        }
      } catch (error) {
        console.log("LOAD SESSION ERROR:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await loginRequest(email, password);

      const receivedToken = response?.data?.token;
      const receivedUser = response?.data?.user;

      if (!receivedToken || !receivedUser) {
        throw new Error("La respuesta del login no contiene token o usuario");
      }

      await AsyncStorage.setItem("token", receivedToken);
      await AsyncStorage.setItem("user", JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      await registerPushToken();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo iniciar sesión";

      throw new Error(message);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await getMyProfileRequest();

      const profile = response.data;

      await AsyncStorage.setItem("user", JSON.stringify(profile));
      setUser(profile);
    } catch (error) {
      console.log("REFRESH PROFILE ERROR:", error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } catch (error) {
      console.log("SIGN OUT ERROR:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};