import React from "react";

import { Button, Classes, H6, Intent, Menu, MenuItem, Spinner } from "@blueprintjs/core";
import {
  IItemListRendererProps,
  IItemRendererProps,
  ItemListRenderer,
  ItemPredicate,
  ItemRenderer,
  Select,
} from "@blueprintjs/select";
import {
  ICreatePreferencesRequest,
  IPreferenceJson,
  IRegionComposite,
  IStatusRealm,
  UpdatePreferencesRequest,
} from "@sotah-inc/core";

import { IProfile, IRealms } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { didRealmChange } from "../../util";

const RealmToggleSelect = Select.ofType<IStatusRealm>();

export interface IStateProps {
  realms: IRealms;
  currentRealm: IStatusRealm | null;
  fetchRealmLevel: FetchLevel;
  userPreferences: IPreferenceJson | null;
  authLevel: AuthLevel;
  profile: IProfile | null;
  currentRegion: IRegionComposite | null;
}

type persistUserPreferencesFunc = (
  token: string,
  body: ICreatePreferencesRequest | UpdatePreferencesRequest,
) => void;

export interface IDispatchProps {
  createUserPreferences: (token: string, body: ICreatePreferencesRequest) => void;
  updateUserPreferences: (token: string, body: UpdatePreferencesRequest) => void;
}

export interface IOwnProps {
  onRealmChange: (realm: IStatusRealm) => void;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class RealmToggle extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props) {
    const {
      currentRealm,
      authLevel,
      userPreferences,
      profile,
      createUserPreferences,
      updateUserPreferences,
      currentRegion,
    } = this.props;

    if (authLevel === AuthLevel.authenticated && currentRealm !== null && currentRegion !== null) {
      const persistUserPreferences: persistUserPreferencesFunc = (() => {
        if (userPreferences !== null) {
          return updateUserPreferences;
        }

        return createUserPreferences;
      })();

      if (didRealmChange(prevProps.currentRealm, currentRealm)) {
        persistUserPreferences(profile!.token, {
          current_realm: currentRealm.slug,
          current_region: currentRegion.config_region.name,
        });
      }
    }
  }

  public itemPredicate: ItemPredicate<IStatusRealm> = (query: string, item: IStatusRealm) => {
    query = query.toLowerCase();
    return (
      item.name.toLowerCase().indexOf(query) >= 0 ||
      item.battlegroup.toLowerCase().indexOf(query) >= 0
    );
  };

  public itemRenderer: ItemRenderer<IStatusRealm> = (
    realm: IStatusRealm,
    { handleClick, modifiers, index }: IItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { currentRealm } = this.props;
    const intent =
      currentRealm !== null && realm.slug === currentRealm.slug ? Intent.PRIMARY : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? Classes.ACTIVE : ""}
        label={realm.battlegroup}
        onClick={handleClick}
        text={realm.name}
      />
    );
  };

  public itemListRenderer: ItemListRenderer<IStatusRealm> = (
    params: IItemListRendererProps<IStatusRealm>,
  ) => {
    const { items, itemsParentRef, renderItem } = params;
    const renderedItems = items.map(renderItem).filter(renderedItem => renderedItem !== null);
    return (
      <Menu ulRef={itemsParentRef}>
        <li>
          <H6>Select Realm</H6>
        </li>
        {renderedItems}
      </Menu>
    );
  };

  public render() {
    const { realms, onRealmChange, currentRealm, fetchRealmLevel } = this.props;

    switch (fetchRealmLevel) {
      case FetchLevel.success:
        const items = Object.keys(realms).map(realmName => realms[realmName]);
        let highlightedRealm = items[0];
        if (currentRealm !== null) {
          highlightedRealm = currentRealm;
        }

        return (
          <RealmToggleSelect
            items={items}
            itemRenderer={this.itemRenderer}
            itemListRenderer={this.itemListRenderer}
            itemPredicate={this.itemPredicate}
            onItemSelect={onRealmChange}
            resetOnSelect={true}
            resetOnClose={true}
          >
            <Button text={highlightedRealm.name} rightIcon="double-caret-vertical" />
          </RealmToggleSelect>
        );
      case FetchLevel.failure:
        return <Spinner className={Classes.SMALL} intent={Intent.DANGER} value={1} />;
      case FetchLevel.initial:
        return <Spinner className={Classes.SMALL} intent={Intent.NONE} value={1} />;
      case FetchLevel.fetching:
      default:
        return <Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />;
    }
  }
}
