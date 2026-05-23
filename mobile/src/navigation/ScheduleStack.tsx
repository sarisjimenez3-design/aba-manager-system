import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScheduleScreen from "../screens/app/ScheduleScreen";
import CreateTrainingScreen from "../screens/app/CreateTrainingScreen";
const Stack = createNativeStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScheduleMain" component={ScheduleScreen} />
      <Stack.Screen name="CreateTraining" component={CreateTrainingScreen} />
    </Stack.Navigator>
  );
}