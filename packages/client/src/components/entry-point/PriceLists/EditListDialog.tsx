import React from "react";

import { Intent, IToastProps } from "@blueprintjs/core";
import { IExpansion, IPricelistJson, IShortProfession, IRegionComposite } from "@sotah-inc/core";

import { ListDialogContainer } from "../../../containers/entry-point/PriceLists/util/ListDialog";
import { IClientRealm, IErrors, IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IUpdatePricelistRequestOptions } from "../../../types/price-lists";
import { IOnCompleteOptions } from "./util/ListDialog";

export interface IStateProps {
  isEditListDialogOpen: boolean;
  updatePricelistLevel: FetchLevel;
  updatePricelistErrors: IErrors;
  profile: IProfile | null;
  selectedList: IPricelistJson | null;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null;
  selectedExpansion: IExpansion | null;
}

export interface IDispatchProps {
  changeIsEditListDialogOpen: (isDialogOpen: boolean) => void;
  updatePricelist: (opts: IUpdatePricelistRequestOptions) => void;
  insertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  browseOnUpdate: (
    region: IRegionComposite,
    realm: IClientRealm,
    pricelist: IPricelistJson,
    professionData?: {
      profession: IShortProfession;
      expansion: IExpansion;
    },
  ) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps & IRouteProps>;

type State = Readonly<{
  listDialogResetTrigger: number;
}>;

export class EditListDialog extends React.Component<Props, State> {
  public state = {
    listDialogResetTrigger: 0,
  };

  public componentDidUpdate(prevProps: Props): void {
    const {
      updatePricelistLevel,
      selectedList,
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      browseOnUpdate,
      insertToast,
    } = this.props;
    const { listDialogResetTrigger } = this.state;

    if (currentRegion === null || currentRealm === null || selectedList === null) {
      return;
    }

    if (prevProps.updatePricelistLevel !== updatePricelistLevel) {
      switch (updatePricelistLevel) {
      case FetchLevel.success: {
        insertToast({
          icon: "info-sign",
          intent: Intent.SUCCESS,
          message: `"${selectedList.name}" has been saved.`,
        });
        this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });

        const professionData = (() => {
          if (selectedProfession === null || selectedExpansion === null) {
            return;
          }

          return { profession: selectedProfession, expansion: selectedExpansion };
        })();

        const shouldBrowse =
            prevProps.selectedList && prevProps.selectedList.slug !== selectedList.slug;
        if (shouldBrowse) {
          browseOnUpdate(currentRegion, currentRealm, selectedList, professionData);
        }

        break;
      }
      default:
        break;
      }
    }
  }

  public render(): React.ReactNode {
    const {
      isEditListDialogOpen,
      updatePricelistErrors,
      updatePricelistLevel,
      selectedList,
    } = this.props;
    const { listDialogResetTrigger } = this.state;

    if (selectedList === null) {
      return null;
    }

    return (
      <ListDialogContainer
        isOpen={isEditListDialogOpen}
        onClose={() => this.onListDialogClose()}
        title="Edit Price List"
        mutationErrors={updatePricelistErrors}
        mutatePricelistLevel={updatePricelistLevel}
        resetTrigger={listDialogResetTrigger}
        defaultName={selectedList.name}
        defaultSlug={selectedList.slug === null ? "" : selectedList.slug}
        defaultEntries={selectedList.pricelist_entries}
        onComplete={(v: IOnCompleteOptions) => this.onListDialogComplete(v)}
      />
    );
  }

  private onListDialogClose() {
    const { changeIsEditListDialogOpen } = this.props;
    const { listDialogResetTrigger } = this.state;

    changeIsEditListDialogOpen(false);
    this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });
  }

  private onListDialogComplete({ name, entries, slug }: IOnCompleteOptions) {
    const { updatePricelist, profile, selectedList } = this.props;

    if (selectedList === null || profile === null) {
      return;
    }

    updatePricelist({
      id: selectedList.id,
      meta: { isEditListDialogOpen: false },
      request: { entries, pricelist: { name, slug } },
      token: profile.token,
    });
  }
}
