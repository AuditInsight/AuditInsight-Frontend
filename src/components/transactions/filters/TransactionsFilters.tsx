"use client";

import React from "react";
import { toolbarStyles } from "@/styles/toolbar.styles";

const TransactionsFilters = () => {
  return (
    <div style={toolbarStyles.container}>
      <div style={toolbarStyles.row}>
        <div style={toolbarStyles.left}>
          <button style={toolbarStyles.button}>Date</button>
          <button style={toolbarStyles.button}>Amount</button>
          <button style={toolbarStyles.button}>Type</button>
          <button style={toolbarStyles.button}>Risk Score</button>
          <button style={toolbarStyles.button}>Evidence</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilters;