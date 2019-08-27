import * as React from "react";

import { Intent } from "@blueprintjs/core";

import { IPricelistJson } from "../../../../api-types/entities";
import { IExpansion } from "../../../../api-types/expansion";
import { IItemsMap } from "../../../../api-types/item";
import { IProfession } from "../../../../api-types/profession";
import { IRealm, IRegion } from "../../../../api-types/region";
import { ListDialogContainer } from "../../../../containers/App/Data/PriceLists/util/ListDialog";
import { IErrors, IProfile } from "../../../../types/global";
import { FetchLevel } from "../../../../types/main";
import { IUpdatePricelistRequestOptions } from "../../../../types/price-lists";
import { GetAppToaster } from "../../../../util/toasters";
import { IOnCompleteOptions } from "./util/ListDialog";

export interface IStateProps {
  isEditListDialogOpen: boolean;
  updatePricelistLevel: FetchLevel;
  updatePricelistErrors: IErrors;
  profile: IProfile | null;
  selectedList: IPricelistJson | null;
  items: IItemsMap;
  currentRegion: IRegion | null;
  currentRealm: IRealm | null;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
}

export interface IDispatchProps {
  appendItems: (items: IItemsMap) => void;
  changeIsEditListDialogOpen: (isDialogOpen: boolean) => void;
  updatePricelist: (opts: IUpdatePricelistRequestOptions) => void;
}

export interface IRouteProps {
  browseToProfessionPricelist: (
    region: IRegion,
    realm: IRealm,
    profession: IProfession,
    expansion: IExpansion,
    pricelist: IPricelistJson,
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

  public componentDidUpdate(prevProps: Props) {
    const {
      updatePricelistLevel,
      selectedList,
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      browseToProfessionPricelist,
    } = this.props;
    const { listDialogResetTrigger } = this.state;

    if (
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null ||
      selectedExpansion === null ||
      selectedList === null
    ) {
      return;
    }

    if (prevProps.updatePricelistLevel !== updatePricelistLevel) {
      switch (updatePricelistLevel) {
        case FetchLevel.success:
          const AppToaster = GetAppToaster(true);
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.SUCCESS,
              message: `"${selectedList.name}" has been saved.`,
            });
          }
          this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });

          browseToProfessionPricelist(
            currentRegion,
            currentRealm,
            selectedProfession,
            selectedExpansion,
            selectedList,
          );

          break;
        default:
          break;
      }
    }
  }

  public render() {
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
        defaultName={selectedList!.name}
        defaultSlug={selectedList!.slug === null ? "" : selectedList.slug!}
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

  private onListDialogComplete({ name, entries, items, slug }: IOnCompleteOptions) {
    const { updatePricelist, profile, selectedList, appendItems } = this.props;

    updatePricelist({
      id: selectedList!.id,
      meta: { isEditListDialogOpen: false },
      request: { entries, pricelist: { name, slug } },
      token: profile!.token,
    });
    appendItems(items);
  }
}
