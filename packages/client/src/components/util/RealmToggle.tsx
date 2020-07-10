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
  UpdatePreferencesRequest,
} from "@sotah-inc/core";

import { IClientRealm, IProfile } from "../../types/global";
import { AuthLevel, FetchLevel } from "../../types/main";
import { didRealmChange } from "../../util";

const RealmToggleSelect = Select.ofType<IClientRealm>();

export interface IStateProps {
  realms: IClientRealm[];
  currentRealm: IClientRealm | null;
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
  onRealmChange: (realm: IClientRealm) => void;
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
          current_realm: currentRealm.realm.slug,
          current_region: currentRegion.config_region.name,
        });
      }
    }
  }

  public itemPredicate: ItemPredicate<IClientRealm> = (query: string, item: IClientRealm) => {
    query = query.toLowerCase();
    return (item.realm.name.en_US ?? "n/a").toLowerCase().indexOf(query) >= 0;
  };

  public itemRenderer: ItemRenderer<IClientRealm> = (
    realm: IClientRealm,
    { handleClick, modifiers, index }: IItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { currentRealm } = this.props;
    const intent =
      currentRealm !== null && realm.realm.slug === currentRealm.realm.slug
        ? Intent.PRIMARY
        : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? Classes.ACTIVE : ""}
        onClick={handleClick}
        text={realm.realm.name.en_US}
      />
    );
  };

  public itemListRenderer: ItemListRenderer<IClientRealm> = (
    params: IItemListRendererProps<IClientRealm>,
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
        let highlightedRealm = realms[0];
        if (currentRealm !== null) {
          highlightedRealm = currentRealm;
        }

        return (
          <RealmToggleSelect
            items={realms}
            itemRenderer={this.itemRenderer}
            itemListRenderer={this.itemListRenderer}
            itemPredicate={this.itemPredicate}
            onItemSelect={onRealmChange}
            resetOnSelect={true}
            resetOnClose={true}
          >
            <Button text={highlightedRealm.realm.name.en_US} rightIcon="double-caret-vertical" />
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
