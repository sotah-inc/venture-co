import React from "react";

import { Dialog } from "@blueprintjs/core";
import { IPricelistEntryJson, IPricelistJson, IShortItem, ItemId } from "@sotah-inc/core";

import {
  CreateEntryFormFormContainer,
} from "../../../form-containers/entry-point/PriceLists/util/CreateEntryForm";
import { IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IUpdatePricelistRequestOptions } from "../../../types/price-lists";

export interface IStateProps {
  isAddEntryDialogOpen: boolean;
  updatePricelistLevel: FetchLevel;
  selectedList: IPricelistJson | null;
  profile: IProfile | null;
}

export interface IDispatchProps {
  changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void;
  updatePricelist: (opts: IUpdatePricelistRequestOptions) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

interface IState {
  entryFormError: string;
}

export class CreateEntryDialog extends React.Component<Props, IState> {
  public state: IState = {
    entryFormError: "",
  };

  public render(): React.ReactNode {
    const {
      isAddEntryDialogOpen,
      updatePricelistLevel,
      changeIsAddEntryDialogOpen,
      selectedList,
    } = this.props;
    const { entryFormError } = this.state;

    if (selectedList === null) {
      return null;
    }

    const itemIdBlacklist: ItemId[] = selectedList.pricelist_entries.map(v => v.item_id);

    return (
      <Dialog
        isOpen={isAddEntryDialogOpen}
        onClose={() => changeIsAddEntryDialogOpen(!isAddEntryDialogOpen)}
        title="New Entry"
        icon="manually-entered-data"
        canOutsideClickClose={false}
      >
        <CreateEntryFormFormContainer
          onComplete={(entry: IPricelistEntryJson) => this.onCreateEntryFormComplete(entry)}
          onItemSelect={v => this.onCreateEntryFormItemSelect(v)}
          isSubmitDisabled={updatePricelistLevel === FetchLevel.fetching}
          externalItemError={entryFormError}
          itemIdBlacklist={itemIdBlacklist}
        />
      </Dialog>
    );
  }

  private onCreateEntryFormComplete(entry: IPricelistEntryJson) {
    const { selectedList, updatePricelist, profile } = this.props;

    if (selectedList === null || selectedList.slug === null || profile === null) {
      return;
    }

    updatePricelist({
      id: selectedList.id,
      meta: { isAddEntryDialogOpen: false },
      request: {
        entries: [...selectedList.pricelist_entries, entry],
        pricelist: { name: selectedList.name, slug: selectedList.slug },
      },
      token: profile.token,
    });
  }

  private onCreateEntryFormItemSelect(item: IShortItem) {
    const { selectedList } = this.props;

    if (selectedList === null) {
      return;
    }

    for (const entry of selectedList.pricelist_entries) {
      if (entry.item_id === item.id) {
        this.setState({ entryFormError: "Item is already in the list." });

        return;
      }
    }

    this.setState({ entryFormError: "" });
  }
}
