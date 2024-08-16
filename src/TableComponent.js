import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.scss";
import { updateCell, setTableData } from "./redux/action";
import instagram from "./assets/instagramLogo.webp";
import youtube from "./assets/youtubeLogo.webp";

// Utility functions
const formatDateToInput = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

const formatDateToDisplay = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

// Validation functions
const isValidInstagramLink = (link) => {
  const instagramReelsPattern =
    /^https:\/\/www\.instagram\.com\/reels\/[A-Za-z0-9_-]+(?:\/|\?|#|$)/;
  console.log("Testing URL:", link);
  console.log("Regex match:", instagramReelsPattern.test(link));
  return instagramReelsPattern.test(link);
};

const isValidYouTubeLink = (link) => {
  const youtubePattern =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/;
  return youtubePattern.test(link);
};

const TableComponent = () => {
  const dispatch = useDispatch();
  const tableData = useSelector((state) => state.tableData);
  const [editMode, setEditMode] = useState({ row: null, col: null });
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const persistedData = localStorage.getItem("tableData");
    if (persistedData) {
      dispatch(setTableData(JSON.parse(persistedData)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (editMode.row !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("tableData");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleCellChange = (rowIndex, key, value) => {
    if (key === "postLink") {
      const platform = tableData[rowIndex]["deliverable"];
      let isValid = true;
      const trimmedValue = value.trim();

      if (platform === "Instagram" && !isValidInstagramLink(trimmedValue)) {
        setError("Invalid Instagram Reels link.");
        isValid = false;
      } else if (platform === "Youtube" && !isValidYouTubeLink(trimmedValue)) {
        setError("Invalid YouTube video link.");
        isValid = false;
      } else {
        setError("");
      }

      if (isValid) {
        const updatedRow = { ...tableData[rowIndex], [key]: value };
        const updatedData = tableData.map((row, index) =>
          index === rowIndex ? updatedRow : row
        );
        dispatch(updateCell(rowIndex, key, value));
        localStorage.setItem("tableData", JSON.stringify(updatedData));
      }
    } else {
      const updatedRow = { ...tableData[rowIndex], [key]: value };
      const updatedData = tableData.map((row, index) =>
        index === rowIndex ? updatedRow : row
      );
      dispatch(updateCell(rowIndex, key, value));
      localStorage.setItem("tableData", JSON.stringify(updatedData));
    }
  };

  const handleCellClick = (rowIndex, colKey, currentValue) => {
    setEditMode({ row: rowIndex, col: colKey });
    setInputValue(currentValue);
  };

  const handleKeyPress = (e, rowIndex, colKey) => {
    if (e.key === "Enter") {
      handleCellChange(rowIndex, colKey, inputValue);
      setEditMode({ row: null, col: null });
    }
  };

  const handleBlur = () => {
    setEditMode({ row: null, col: null });
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const columns = [
    { key: "deliverableID", label: "Deliverable ID", editable: false },
    { key: "deliverable", label: "Deliverable", editable: false },
    { key: "deliverableName", label: "Deliverable Name", editable: true },
    { key: "finalCreatorPrice", label: "Final Creator Price", editable: true },
    { key: "finalBrandPrice", label: "Final Brand Price", editable: true },
    {
      key: "deliverableApproved",
      label: "Deliverable Approved",
      editable: true,
      type: "dropdown",
      options: ["Yes", "No"],
    },
    {
      key: "expectedGoLiveDate",
      label: "Expected Go Live Date",
      editable: true,
      type: "date",
    },
    {
      key: "contentPublished",
      label: "Content Published",
      editable: true,
      type: "dropdown",
      options: ["Yes", "No"],
    },
    {
      key: "contentPublishedDate",
      label: "Content Published Date",
      editable: true,
      type: "date",
    },
    { key: "postLink", label: "Post Link", editable: true },
  ];

  return (
    <div className={styles["table-wrapper"]}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles[col.key]}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={
                    col.key === "deliverable"
                      ? styles.deliverables
                      : styles[col.key]
                  }
                  onClick={() =>
                    col.editable &&
                    handleCellClick(rowIndex, col.key, row[col.key])
                  }
                >
                  {editMode.row === rowIndex && editMode.col === col.key ? (
                    col.type === "dropdown" ? (
                      <select
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={inputRef}
                      >
                        {col.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : col.type === "date" ? (
                      <input
                        type="date"
                        value={formatDateToInput(inputValue)}
                        onChange={(e) =>
                          handleCellChange(
                            rowIndex,
                            col.key,
                            formatDateToDisplay(e.target.value)
                          )
                        }
                        onBlur={handleBlur}
                        ref={inputRef}
                      />
                    ) : (
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyPress(e, rowIndex, col.key)}
                        onBlur={handleBlur}
                        ref={inputRef}
                      />
                    )
                  ) : (
                    <span>
                      {col.key === "deliverable" ? (
                        row[col.key] === "Instagram" ? (
                          <>
                            <img
                              src={instagram}
                              alt="instagram"
                              width={20}
                              className="me-2"
                            />{" "}
                            Instagram
                          </>
                        ) : row[col.key] === "Youtube" ? (
                          <>
                            <img
                              src={youtube}
                              alt="youtube"
                              width={25}
                              className="me-2"
                            />{" "}
                            Youtube
                          </>
                        ) : (
                          row[col.key]
                        )
                      ) : col.key === "finalCreatorPrice" ||
                        col.key === "finalBrandPrice" ? (
                        `₹ ${row[col.key]}`
                      ) : col.type === "date" ? (
                        formatDateToDisplay(row[col.key])
                      ) : (
                        row[col.key]
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="text-danger fs-16 fw-600">{error}</p>}
    </div>
  );
};

export default TableComponent;
