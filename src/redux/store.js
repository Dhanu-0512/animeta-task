import { createStore } from "redux";
import { tableReducer } from "./reducer";

const persistedState = localStorage.getItem("tableData")
  ? { tableData: JSON.parse(localStorage.getItem("tableData")) }
  : undefined;

const store = createStore(tableReducer, persistedState);

export default store;
