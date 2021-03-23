import React from "react";
import "./style.css";

interface DisclaimerProps {
  onAgree: () => unknown;
}

export default function Disclaimer(props: DisclaimerProps) {
  return (
    <>
      <p className="Disclaimer--text">
        Welcome! Before using the extension just a few important points of note:
      </p>

      <ol className="Disclaimer--list">
        <li>
          <strong>Do not use this in multiplayer or tournaments</strong>
        </li>

        <li>
          The radio streams are randomly selected from the Internet, as such
          there can be disturbing or mature content
        </li>

        <li>
          Content creators beware: there is a very high chance that this will
          end up getting your content striked for DMCA issues
        </li>
      </ol>

      <div className="btn btn-good" onClick={props.onAgree}>
        I understand
      </div>
    </>
  );
}
