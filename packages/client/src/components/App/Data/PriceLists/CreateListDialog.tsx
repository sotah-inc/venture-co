import React from "react";

import { Intent } from "@blueprintjs/core";
import {
  ICreatePricelistRequest,
  ICreateProfessionPricelistRequest,
  IExpansion,
  IItemsMap,
  IPricelistJson,
  IProfession,
  IRealm,
  IRegion,
} from "@sotah-inc/core";

import { ListDialogContainer } from "../../../../containers/App/Data/PriceLists/util/ListDialog";
import { IErrors, IProfile } from "../../../../types/global";
import { FetchLevel } from "../../../../types/main";
import { GetAppToaster } from "../../../../util/toasters";
import { IOnCompleteOptions } from "./util/ListDialog";

export interface IStateProps {
  isAddListDialogOpen: boolean;
  createPricelistLevel: FetchLevel;
  createPricelistErrors: IErrors;
  profile: IProfile | null;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
  currentRegion: IRegion | null;
  currentRealm: IRealm | null;
  selectedList: IPricelistJson | null;
}

export interface IDispatchProps {
  appendItems: (items: IItemsMap) => void;
  changeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
  createPricelist: (token: string, request: ICreatePricelistRequest) => void;
  createProfessionPricelist: (token: string, request: ICreateProfessionPricelistRequest) => void;
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

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

type State = Readonly<{
  listDialogResetTrigger: number;
}>;

export class CreateListDialog extends React.Component<Props, State> {
  public state = {
    listDialogResetTrigger: 0,
  };

  public componentDidUpdate(prevProps: Props) {
    const {
      createPricelistLevel,
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

    if (prevProps.createPricelistLevel !== createPricelistLevel) {
      switch (createPricelistLevel) {
        case FetchLevel.success:
          const AppToaster = GetAppToaster(true);
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.SUCCESS,
              message: "Your pricelist has been created.",
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
      isAddListDialogOpen,
      changeIsAddListDialogOpen,
      createPricelistErrors,
      createPricelistLevel,
      selectedProfession,
    } = this.props;
    const { listDialogResetTrigger } = this.state;

    let dialogTitle = "New Price List";
    if (selectedProfession !== null) {
      dialogTitle = `New ${selectedProfession.label} Price List`;
    }

    return (
      <ListDialogContainer
        isOpen={isAddListDialogOpen}
        onClose={() => changeIsAddListDialogOpen(!isAddListDialogOpen)}
        title={dialogTitle}
        mutationErrors={createPricelistErrors}
        mutatePricelistLevel={createPricelistLevel}
        resetTrigger={listDialogResetTrigger}
        onComplete={(v: IOnCompleteOptions) => this.onListDialogComplete(v)}
      />
    );
  }

  private onListDialogComplete({ name, slug, entries, items }: IOnCompleteOptions) {
    const {
      createPricelist,
      profile,
      appendItems,
      selectedProfession,
      createProfessionPricelist,
      selectedExpansion,
    } = this.props;

    if (selectedProfession === null) {
      createPricelist(profile!.token, {
        entries,
        pricelist: { name, slug },
      });
    } else {
      createProfessionPricelist(profile!.token, {
        entries,
        expansion_name: selectedExpansion!.name,
        pricelist: { name, slug },
        profession_name: selectedProfession.name,
      });
    }

    appendItems(items);
  }
}
