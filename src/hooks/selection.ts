import { useEffect, useState } from "react";

type SelectionData = {
  selection: Selection;
  range: Range;
  selectedText: string;
};

export function useSelection(input: {
  selectionContainerId?: string;
}): SelectionData | null {
  const { selectionContainerId } = input;

  const [container, setContainer] = useState<Node | null>(null);
  const [selection, setSelection] = useState<SelectionData | null>(null);

  function onSelectionChange() {
    const selection = window.getSelection();
    if (!selection || selection.type !== "Range") {
      setSelection(null);
      return;
    }

    if (container) {
      const hasAnchorNode = container.contains(selection.anchorNode);
      const hasFocusNode = container.contains(selection.focusNode);
      if (!hasAnchorNode || !hasFocusNode) {
        return;
      }
    }

    setSelection({
      selection,
      range: selection.getRangeAt(0),
      selectedText: selection.toString(),
    });
  }

  useEffect(() => {
    if (!selectionContainerId) {
      return;
    }

    setContainer(document.getElementById(selectionContainerId));
  }, [selectionContainerId]);

  useEffect(() => {
    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  return selection;
}
