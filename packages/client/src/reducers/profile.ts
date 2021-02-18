import { ProfileActions } from "../actions/profile";
import { defaultProfileState, IProfileState } from "../types/profile";
import { runners } from "./handlers";

type State = Readonly<IProfileState>;

export function profile(state: State | undefined, action: ProfileActions): State {
  if (typeof state === "undefined") {
    return defaultProfileState;
  }

  return runners.profile(state, action);
}
