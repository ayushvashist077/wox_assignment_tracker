import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./helpers";

export const exportAssignmentsPDF = (assignments) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.text("Assignment Tracker - MBA", 14, 22);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(127, 140, 141);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 30);

  // Table
  const tableData = assignments.map((a, index) => [
    index + 1,
    a.subject,
    a.title,
    a.description.length > 50
      ? a.description.substring(0, 50) + "..."
      : a.description,
    formatDate(a.deadline),
    a.status,
  ]);

  autoTable(doc, {
    startY: 36,
    head: [["#", "Subject", "Title", "Description", "Deadline", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 50 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
    },
  });

  doc.save("assignments.pdf");
};