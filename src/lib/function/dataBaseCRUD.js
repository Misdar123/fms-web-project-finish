import { ref, set, onValue, update } from "firebase/database";
import { dataBase } from "../config/firebase";

export const writeDataBase = async (path, data) => {
  try {
    await set(ref(dataBase, path), data);
    console.log("create data succsess");
  } catch (e) {
    console.error(e);
  }
};

export const readDataBase = async (path, callback) => {
  const dataBaseRefrence = ref(dataBase, path);
  onValue(dataBaseRefrence, (snapshot) => {
    const result = snapshot.val();
    callback(result);
  });
};

export const updateDataBase = async (path, newData) => {
  const updates = {};
  updates[path] = newData;
  return update(ref(dataBase), updates)
    .then(() => console.log("update succsess"))
    .catch((e) => console.error(e));
};
