import React from "react";

import { Intent, IToastProps } from "@blueprintjs/core";
import {
  ICreatePricelistRequest,
  ICreateProfessionPricelistRequest,
  IExpansion,
  IPricelistJson,
  IProfession,
  IRegion,
  IStatusRealm,
} from "@sotah-inc/core";

import { ListDialogContainer } from "../../../containers/entry-point/PriceLists/util/ListDialog";
import { IFetchInfo, IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { IOnCompleteOptions } from "./util/ListDialog";

export interface IStateProps {
  isAddListDialogOpen: boolean;
  createPricelist: IFetchInfo;
  profile: IProfile | null;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  selectedList: IPricelistJson | null;
}

export interface IDispatchProps {
  ChangeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
  FetchCreatePricelist: (token: string, request: ICreatePricelistRequest) => void;
  FetchCreateProfessionPricelist: (
    token: string,
    request: ICreateProfessionPricelistRequest,
  ) => void;
  InsertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  browseOnCreate: (
    region: IRegion,
    realm: IStatusRealm,
    pricelist: IPricelistJson,
    professionData?: {
      profession: IProfession;
      expansion: IExpansion;
    },
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
      createPricelist,
      selectedList,
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      browseOnCreate,
      InsertToast,
    } = this.props;
    const { listDialogResetTrigger } = this.state;

    if (currentRegion === null || currentRealm === null || selectedList === null) {
      return;
    }

    if (prevProps.createPricelist.level !== createPricelist.level) {
      switch (createPricelist.level) {
        case FetchLevel.success:
          InsertToast({
            icon: "info-sign",
            intent: Intent.SUCCESS,
            message: "Your pricelist has been created.",
          });
          this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });

          const professionData = (() => {
            if (selectedProfession === null || selectedExpansion === null) {
              return;
            }

            return { profession: selectedProfession, expansion: selectedExpansion };
          })();

          browseOnCreate(currentRegion, currentRealm, selectedList, professionData);

          break;
        default:
          break;
      }
    }
  }

  public render() {
    const {
      isAddListDialogOpen,
      ChangeIsAddListDialogOpen,
      createPricelist,
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
        onClose={() => ChangeIsAddListDialogOpen(!isAddListDialogOpen)}
        title={dialogTitle}
        mutationErrors={createPricelist.errors}
        mutatePricelistLevel={createPricelist.level}
        resetTrigger={listDialogResetTrigger}
        onComplete={(v: IOnCompleteOptions) => this.onListDialogComplete(v)}
      />
    );
  }

  private onListDialogComplete({ name, slug, entries }: IOnCompleteOptions) {
    const {
      FetchCreatePricelist,
      profile,
      selectedProfession,
      FetchCreateProfessionPricelist,
      selectedExpansion,
    } = this.props;

    if (selectedProfession === null) {
      FetchCreatePricelist(profile!.token, {
        entries,
        pricelist: { name, slug },
      });
    } else {
      FetchCreateProfessionPricelist(profile!.token, {
        entries,
        expansion_name: selectedExpansion!.name,
        pricelist: { name, slug },
        profession_name: selectedProfession.name,
      });
    }
  }
}
