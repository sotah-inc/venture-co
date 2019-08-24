import { IToaster, Position, Toaster } from "@blueprintjs/core";

let AppToaster: IToaster | null = null;
export const GetAppToaster = () => {
  if (AppToaster !== null) {
    return AppToaster;
  }

  if (typeof document === "undefined") {
    return null;
  }

  AppToaster = Toaster.create({
    position: Position.BOTTOM,
  });

  return AppToaster;
};
