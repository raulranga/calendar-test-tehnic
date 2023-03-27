import React from "react";

export default function Intervals(props) {
  return (
    <div className="intervals">
      <input
        type="number"
        placeholder="h"
        name={props.hour}
        value={props.hourValue}
        min="8"
        max="20"
        onChange={props.handleChange}
      />
      <span>:</span>
      <input
        type="number"
        placeholder="min"
        name={props.min}
        value={props.minValue}
        min="0"
        max="59"
        onChange={props.handleChange}
      />
    </div>
  );
}
