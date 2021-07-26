import {
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IGameVersionTuple,
  IRegionComposite,
  IRegionVersionConnectedRealmTuple,
  IRegionVersionRealmTuple,
  RegionVersionTuple,
} from "@sotah-inc/core";

import {
  IRealmModificationDatesResponse,
  IResolveConnectedRealmResponse,
  IValidateRegionConnectedRealmResponse,
  ValidateRegionRealmResponse,
  ValidateRegionResponse,
} from "../contracts";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  connectedRealmModificationDates = "connectedRealmModificationDates",
  connectedRealms = "connectedRealms",
  queryRealmModificationDates = "queryRealmModificationDates",
  resolveConnectedRealm = "resolveConnectedRealm",
  status = "status",
  validateGameVersion = "validateGameVersion",
  validateRegion = "validateRegion",
  validateRegionConnectedRealm = "validateRegionConnectedRealm",
  validateRegionRealm = "validateRegionRealm",
}

export class RegionsMessenger extends BaseMessenger {
  public connectedRealmModificationDates(): Promise<Message<IRealmModificationDatesResponse>> {
    return this.request(subjects.connectedRealmModificationDates);
  }

  public connectedRealms(tuple: RegionVersionTuple): Promise<Message<IConnectedRealmComposite[]>> {
    return this.request(subjects.connectedRealms, {
      body: JSON.stringify(tuple),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public queryRealmModificationDates(
    tuple: IRegionVersionConnectedRealmTuple,
  ): Promise<Message<IConnectedRealmModificationDates>> {
    return this.request(subjects.queryRealmModificationDates, { body: JSON.stringify(tuple) });
  }

  public resolveConnectedRealm(
    tuple: IRegionVersionRealmTuple,
  ): Promise<Message<IResolveConnectedRealmResponse>> {
    return this.request(subjects.resolveConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public status(tuple: RegionVersionTuple): Promise<Message<IRegionComposite>> {
    return this.request(subjects.status, {
      body: JSON.stringify(tuple),
    });
  }

  public validateGameVersion(
    tuple: IGameVersionTuple,
  ): Promise<Message<ValidateRegionRealmResponse>> {
    return this.request(subjects.validateGameVersion, {
      body: JSON.stringify(tuple),
    });
  }

  public validateRegion(tuple: RegionVersionTuple): Promise<Message<ValidateRegionResponse>> {
    return this.request(subjects.validateRegion, {
      body: JSON.stringify(tuple),
    });
  }

  public validateRegionConnectedRealm(
    tuple: IRegionVersionConnectedRealmTuple,
  ): Promise<Message<IValidateRegionConnectedRealmResponse>> {
    return this.request(subjects.validateRegionConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public validateRegionRealm(
    tuple: IRegionVersionRealmTuple,
  ): Promise<Message<ValidateRegionRealmResponse>> {
    return this.request(subjects.validateRegionRealm, {
      body: JSON.stringify(tuple),
    });
  }
}
