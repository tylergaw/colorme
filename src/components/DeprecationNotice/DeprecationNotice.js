import React from "react";
import "./DeprecationNotice.css";

const DeprecationNotice = () => (
  <div className="deprecation">
    <b>* Note:</b> The CSS color function here is deprecated. As of late 2020
    there is a new spec. This site will be updated someday. See{" "}
    <a href="https://github.com/tylergaw/colorme/issues/18">
      this Github issue
    </a>{" "}
    for background.
  </div>
);

export default DeprecationNotice;
