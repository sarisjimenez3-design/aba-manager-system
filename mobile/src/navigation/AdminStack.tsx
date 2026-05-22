import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "../screens/app/AdminDashboardScreen";
import AthletesScreen from "../screens/app/AthletesScreen";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Athletes" component={AthletesScreen} />
    </Stack.Navigator>
  );
}