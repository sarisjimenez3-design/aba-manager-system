import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import HomeScreen from "../screens/app/HomeScreen";
import ProfileScreen from "../screens/app/ProfileScreen";
import PaymentsScreen from "../screens/app/PaymentsScreen";
import ScheduleScreen from "../screens/app/ScheduleScreen";
import AdminDashboardScreen from "../screens/app/AdminDashboardScreen";
import SupportScreen from "../screens/app/SupportScreen";
import { useAuth } from "../hooks/useAuth";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const canSeePayments =
    user?.role === "ATHLETE" || user?.role === "PARENT" || isAdmin;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryMedium,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 65,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: COLORS.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Inicio") iconName = "home-outline";
          if (route.name === "Pagos") iconName = "card-outline";
          if (route.name === "Agenda") iconName = "calendar-outline";
          if (route.name === "Soporte") iconName = "chatbubble-outline";
          if (route.name === "Admin") iconName = "grid-outline";
          if (route.name === "Perfil") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />

      {canSeePayments && (
        <Tab.Screen name="Pagos" component={PaymentsScreen} />
      )}

      <Tab.Screen name="Agenda" component={ScheduleScreen} />
      <Tab.Screen name="Soporte" component={SupportScreen} />

      {isAdmin && <Tab.Screen name="Admin" component={AdminDashboardScreen} />}

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}