import {
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IRegionComposite,
  IRegionVersionTuple,
} from "@sotah-inc/core";

import {
  IRealmModificationDatesResponse,
  IResolveConnectedRealmResponse,
  IValidateRegionConnectedRealmResponse,
  ValidateRegionRealmResponse,
} from "../contracts";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  status = "status",
  connectedRealms = "connectedRealms",
  resolveConnectedRealm = "resolveConnectedRealm",
  queryRealmModificationDates = "queryRealmModificationDates",
  connectedRealmModificationDates = "connectedRealmModificationDates",
  validateGameVersion = "validateGameVersion",
  validateRegionRealm = "validateRegionRealm",
  validateRegionConnectedRealm = "validateRegionConnectedRealm",
}

export class RegionsMessenger extends BaseMessenger {
  public getStatus(tuple: IRegionVersionTuple): Promise<Message<IRegionComposite>> {
    return this.request(subjects.status, {
      body: JSON.stringify(tuple),
    });
  }

  public getConnectedRealms(
    tuple: IRegionVersionTuple,
  ): Promise<Message<IConnectedRealmComposite[]>> {
    return this.request(subjects.connectedRealms, {
      body: JSON.stringify(tuple),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public validateRegionConnectedRealm(
    tuple: IRegionConnectedRealmTuple,
  ): Promise<Message<IValidateRegionConnectedRealmResponse>> {
    return this.request(subjects.validateRegionConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public resolveConnectedRealm(
    tuple: IRegionRealmTuple,
  ): Promise<Message<IResolveConnectedRealmResponse>> {
    return this.request(subjects.resolveConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public validateRegionRealm(
    tuple: IRegionRealmTuple,
  ): Promise<Message<ValidateRegionRealmResponse>> {
    return this.request(subjects.validateRegionRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public validateGameVersion(
    tuple: IRegionRealmTuple,
  ): Promise<Message<ValidateRegionRealmResponse>> {
    return this.request(subjects.validateGameVersion, {
      body: JSON.stringify(tuple),
    });
  }

  public queryRealmModificationDates(
    tuple: IRegionConnectedRealmTuple,
  ): Promise<Message<IConnectedRealmModificationDates>> {
    return this.request(subjects.queryRealmModificationDates, { body: JSON.stringify(tuple) });
  }

  public getConnectedRealmModificationDates(): Promise<Message<IRealmModificationDatesResponse>> {
    return this.request(subjects.connectedRealmModificationDates);
  }
}
