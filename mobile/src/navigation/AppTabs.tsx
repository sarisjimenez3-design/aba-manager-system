import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import HomeScreen from "../screens/app/HomeScreen";
import ProfileScreen from "../screens/app/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
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
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Inicio") iconName = "home";
          if (route.name === "Perfil") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}