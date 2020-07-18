import { ProfileActions, ReceiveUpdateProfile, RequestUpdateProfile } from "../../actions/profile";
import { FetchLevel } from "../../types/main";
import { IProfileState } from "../../types/profile";

import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IProfileState, ProfileActions> = {
  profile: {
    update: {
      receive: (state: IProfileState, action: ReturnType<typeof ReceiveUpdateProfile>) => {
        if (typeof action.payload.errors !== "undefined") {
          return {
            ...state,
            updateProfileErrors: action.payload.errors,
            updateProfileLevel: FetchLevel.failure,
          };
        }

        if (typeof action.payload.error !== "undefined") {
          return {
            ...state,
            updateProfileErrors: { error: action.payload.error },
            updateProfileLevel: FetchLevel.failure,
          };
        }

        return {
          ...state,
          updateProfileErrors: {},
          updateProfileLevel: FetchLevel.success,
        };
      },
      request: (state: IProfileState, _: ReturnType<typeof RequestUpdateProfile>) => {
        return {
          ...state,
          updateProfileErrors: {},
          updateProfileLevel: FetchLevel.fetching,
        };
      },
    },
  },
};

export const run: Runner<IProfileState, ProfileActions> = (
  state: IProfileState,
  action: ProfileActions,
): IProfileState => {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  const taskHandler = handlers[kind]?.[verb]?.[task] ?? null;
  if (taskHandler === null) {
    return state;
  }

  return taskHandler(state, action);
};
