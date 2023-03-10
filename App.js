import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationScreen } from "./app/navigation";
import store from "./app/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationScreen />
      <StatusBar style='auto' />
    </Provider>
  );
}
