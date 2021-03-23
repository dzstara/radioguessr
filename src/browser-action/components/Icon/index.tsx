import React from "react";
import "./style.css";

export function Icon(props: { name: string }) {
  return <span className="material-icons" children={props.name} />;
}
