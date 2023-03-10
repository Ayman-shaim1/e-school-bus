// import SyncStorage from "react-native-sync-storage";
import SyncStorage from "sync-storage";
export const saveData = (key, value) => {
  try {
    SyncStorage.set(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const removeData = key => {
  try {
    SyncStorage.remove(key);
  } catch (error) {
    console.log(error);
  }
};

export const getData = key => {
  try {
    const value = SyncStorage.get(key);
    return value;
  } catch (error) {
    console.log(error);
  }
};
