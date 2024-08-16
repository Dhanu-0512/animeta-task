import React from "react";
import { Provider } from "react-redux";
import TableComponent from "./TableComponent";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <div className="m-5">
        <h1>Editable Table</h1>
        <TableComponent />
      </div>
    </Provider>
  );
};

export default App;
