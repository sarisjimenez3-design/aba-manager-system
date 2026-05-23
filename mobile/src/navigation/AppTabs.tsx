import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/app/HomeScreen";
import ProfileStack from "./ProfileStack";
import PaymentsScreen from "../screens/app/PaymentsScreen";
import ScheduleStack from "./ScheduleStack";
import SupportScreen from "../screens/app/SupportScreen";
import AdminStack from "./AdminStack";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const isAdmin = user?.role === "ADMIN";
  const canSeePayments =
    user?.role === "ATHLETE" || user?.role === "PARENT" || isAdmin;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primaryMedium,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
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

      <Tab.Screen name="Agenda" component={ScheduleStack} />

      <Tab.Screen name="Soporte" component={SupportScreen} />

      {isAdmin && <Tab.Screen name="Admin" component={AdminStack} />}

      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}