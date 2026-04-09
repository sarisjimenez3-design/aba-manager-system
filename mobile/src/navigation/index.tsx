import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/colors";
import { useAuth } from "../hooks/useAuth";
import AppTabs from "./AppTabs";
import AuthStack from "./AuthStack";

export default function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator color={COLORS.primaryMedium} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}