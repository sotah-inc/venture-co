import {
  CHANGE_IS_LOGIN_DIALOG_OPEN,
  CHANGE_IS_REGISTER_DIALOG_OPEN,
  LOAD_ROOT_ENTRYPOINT,
  MainActions,
  REALM_CHANGE,
  REGION_CHANGE,
  USER_LOGIN,
  USER_REGISTER,
} from "../actions/main";
import { AuthLevel, defaultMainState, FetchLevel, IMainState } from "../types/main";
import { runners } from "./handlers";

type State = Readonly<IMainState>;

export function main(state: State | undefined, action: MainActions): State {
  if (typeof state === "undefined") {
    return defaultMainState;
  }

  switch (action.type) {
  case USER_REGISTER:
  case USER_LOGIN:
    return {
      ...state,
      userData: {
        ...state.userData,
        profile: action.payload,
        authLevel: AuthLevel.authenticated,
      },
    };
  case REGION_CHANGE:
    return {
      ...state,
      currentRegion: action.payload,
    };
  case REALM_CHANGE:
    return { ...state, currentRealm: action.payload };
  case CHANGE_IS_LOGIN_DIALOG_OPEN:
    return { ...state, isLoginDialogOpen: action.payload };
  case CHANGE_IS_REGISTER_DIALOG_OPEN:
    return { ...state, isRegisterDialogOpen: action.payload };
  case LOAD_ROOT_ENTRYPOINT:
    return {
      ...state,
      bootData: {
        level: action.payload.boot !== null ? FetchLevel.success : FetchLevel.failure,
        data: action.payload.boot !== null ? action.payload.boot : defaultMainState.bootData.data,
        errors: {},
      },
      itemClasses: {
        level: action.payload.itemClasses !== null ? FetchLevel.success : FetchLevel.failure,
        data:
            action.payload.itemClasses !== null
              ? action.payload.itemClasses
              : defaultMainState.itemClasses.data,
        errors: {},
      },
    };
  default:
    return runners.main(state, action);
  }
}
