import {
  ref,
  getDatabase,
  query,
  equalTo,
  get,
  orderByChild,
  onValue,
} from "firebase/database";
import app from "../firebase/config";
// firebase realtime databse :
const database = getDatabase(app);

export default function getUserType(user) {
  let type = "";
  const id = user.localId;

  return type;
}
