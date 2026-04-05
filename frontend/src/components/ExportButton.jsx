import React from "react";
import axios from "axios";

function ExportButton() {
  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/export_candidates",
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "candidates.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting candidates:", error);
    }
  };

  return (
    <button className="secondary-action" onClick={handleExport}>
      Export Excel
    </button>
  );
}

export default ExportButton;
