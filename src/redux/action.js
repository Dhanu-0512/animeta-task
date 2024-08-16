export const updateCell = (rowIndex, key, value) => ({
  type: "UPDATE_CELL",
  payload: { rowIndex, key, value },
});

export const setTableData = (data) => ({
  type: "SET_TABLE_DATA",
  payload: data,
});
