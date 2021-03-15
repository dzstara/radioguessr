import { createElement as e, Fragment } from "react";
import "./style.css";

interface DisclaimerProps {
  onAgree: () => unknown;
}

export default function Disclaimer(props: DisclaimerProps) {
  return e(
    Fragment,
    null,
    e(
      "p",
      { className: "Disclaimer--text" },
      "Welcome! Before using the extension just a few important points of note:"
    ),
    e(
      "ol",
      { className: "Disclaimer--list" },
      e("li", null, e("strong", null, "Do not use this in tournaments")),
      e(
        "li",
        null,
        "The radio streams are randomly selected from the Internet, as such there can be disturbing or mature content"
      ),
      e(
        "li",
        null,
        "Content creators beware: there is a very high chance that this will end up getting your content striked for DMCA issues"
      )
    ),
    e(
      "div",
      { className: "btn btn-valid", onClick: props.onAgree },
      "I understand"
    )
  );
}
