import {
  CHANGE_AUTH_LEVEL,
  CHANGE_IS_LOGIN_DIALOG_OPEN,
  CHANGE_IS_REGISTER_DIALOG_OPEN,
  LOAD_ROOT_ENTRYPOINT,
  MainActions,
  REALM_CHANGE,
  ReceiveGetBoot,
  ReceiveGetPing,
  RECEIVE_USER_RELOAD,
  REGION_CHANGE,
  USER_LOGIN,
  USER_REGISTER,
} from "../actions/main";
import { AuthLevel, defaultMainState, FetchLevel, IMainState } from "../types/main";
import { runners } from "./handlers";

type State = Readonly<IMainState>;

export const main = (state: State | undefined, action: MainActions): State => {
  if (typeof state === "undefined") {
    return defaultMainState;
  }

  switch (action.type) {
    case USER_REGISTER:
      return {
        ...state,
        authLevel: AuthLevel.authenticated,
        isRegistered: true,
        profile: action.payload,
      };
    case USER_LOGIN:
      return {
        ...state,
        authLevel: AuthLevel.authenticated,
        isLoggedIn: true,
        profile: action.payload,
      };
    case RECEIVE_USER_RELOAD:
      if (action.payload.error !== null) {
        return { ...state, authLevel: AuthLevel.unauthenticated };
      }

      return {
        ...state,
        authLevel: AuthLevel.authenticated,
        profile: { user: action.payload.user!, token: state.preloadedToken },
      };
    case CHANGE_AUTH_LEVEL:
      return { ...state, authLevel: action.payload };
    case REGION_CHANGE:
      return { ...state, currentRegion: action.payload, fetchRealmLevel: FetchLevel.prompted };
    case REALM_CHANGE:
      return { ...state, currentRealm: action.payload };
    case CHANGE_IS_LOGIN_DIALOG_OPEN:
      return { ...state, isLoginDialogOpen: action.payload };
    case CHANGE_IS_REGISTER_DIALOG_OPEN:
      return { ...state, isRegisterDialogOpen: action.payload };
    case LOAD_ROOT_ENTRYPOINT:
      return [ReceiveGetPing(action.payload.ping), ReceiveGetBoot(action.payload.boot)].reduce(
        (current, proposedAction) => {
          return runners.main(current, proposedAction);
        },
        state,
      );
    default:
      return runners.main(state, action);
  }
};
