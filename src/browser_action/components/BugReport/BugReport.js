const { createElement: e } = React;

export default function BugReport() {
  const onClick = () => {
    browser.tabs.create({
      url: "https://github.com/dzstara/radioguessr/issues/new/choose",
      active: true,
    });
  };

  return e("span", { className: "Report", onClick }, "Report a bug");
}