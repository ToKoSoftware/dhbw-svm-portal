export interface UiButton {
  title: string;
  url?: string;
  function?: () => void;
  type?: UiButtonType;
  icon?: string | null;
}

export enum UiButtonType {
  noAction,
  disabled,
}

export interface UiButtonGroup {
  buttons: UiButton[];
}

export interface UiBreadcrumb {
  title: string;
  routerLink: string;
}
