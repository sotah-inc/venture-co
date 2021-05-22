import {
  ReceiveGetConnectedRealms as ReceiveGetConnectedRealmsAction,
} from "../../../actions/main";
import { IClientRealm } from "../../../types/global";
import { FetchLevel, IMainState } from "../../../types/main";

export function receiveGetConnectedRealms(
  state: IMainState,
  action: ReturnType<typeof ReceiveGetConnectedRealmsAction>,
): IMainState {
  if (action.payload === null || action.payload.length === 0) {
    return { ...state, realms: { ...state.realms, level: FetchLevel.failure } };
  }

  const realms = action.payload.reduce<IClientRealm[]>((out, connectedRealm) => {
    return [
      ...out,
      ...connectedRealm.connected_realm.realms.map<IClientRealm>(v => {
        return {
          connectedRealmId: connectedRealm.connected_realm.id,
          population: connectedRealm.connected_realm.population,
          realm: v,
          realmModificationDates: connectedRealm.modification_dates,
          regionName: state.currentRegion?.config_region.name ?? "",
        };
      }),
    ];
  }, []);

  const currentRealm: IClientRealm = (() => {
    // optionally halting on blank user-preferences
    if (state.userPreferences.level !== FetchLevel.success) {
      return realms[0];
    }

    if (state.currentRegion === null || state.userPreferences.data.current_realm === null) {
      return realms[0];
    }

    // defaulting to first realm in list if region is different from preferred region
    if (state.currentRegion.config_region.name !== state.userPreferences.data.current_realm) {
      return realms[0];
    }

    // defaulting to first realm in list if non-match
    return realms.find(v => v.realm.slug === state.userPreferences.data.current_realm) ?? realms[0];
  })();

  return {
    ...state,
    currentRealm,
    realms: { level: FetchLevel.success, data: realms, errors: {} },
  };
}
