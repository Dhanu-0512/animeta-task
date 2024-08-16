const initialState = {
  tableData: [
    {
      deliverableID: 1,
      deliverable: "Instagram",
      deliverableName: "Intro Video",
      finalCreatorPrice: "100",
      finalBrandPrice: "120",
      deliverableApproved: "Yes",
      expectedGoLiveDate: "2023-12-01",
      contentPublished: "No",
      contentPublishedDate: "2023-12-01",
      postLink:
        "https://www.instagram.com/reels/C7V17d5v2qV/?igsh=NWI4bnNxdHBxZGlw",
    },
    {
      deliverableID: 2,
      deliverable: "Youtube",
      deliverableName: "How to Code",
      finalCreatorPrice: "150",
      finalBrandPrice: "180",
      deliverableApproved: "No",
      expectedGoLiveDate: "2024-01-01",
      contentPublished: "Yes",
      contentPublishedDate: "2024-01-02",
      postLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ],
};

export const tableReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CELL":
      const { rowIndex, key, value } = action.payload;
      const updatedTableData = state.tableData.map((row, i) =>
        i === rowIndex ? { ...row, [key]: value } : row
      );
      localStorage.setItem("tableData", JSON.stringify(updatedTableData));
      return { ...state, tableData: updatedTableData };
    case "SET_TABLE_DATA":
      return { ...state, tableData: action.payload };
    default:
      return state;
  }
};
