export async function loadStyleSheets(items: StyleSheetLoadingItem[]) {
  items.forEach((item) => {
    loadStyleSheet(item.stylePath, item.elementName);
  });
}

async function loadStyleSheet(styleModule: Promise<{ default: string }>, elementName: string = '') {
  // Import style if not already done
  if (document.getElementById(elementName) == null) {
    // @ts-ignore
    const fileStyle = await styleModule;
    const styleElement = document.createElement('style');
    styleElement.id = elementName;
    styleElement.appendChild(document.createTextNode(
      fileStyle.default
    ));
    document.head.appendChild(styleElement);
  }
}

export interface StyleSheetLoadingItem {
  stylePath: Promise<{ default: string }>;
  elementName: string;
}
