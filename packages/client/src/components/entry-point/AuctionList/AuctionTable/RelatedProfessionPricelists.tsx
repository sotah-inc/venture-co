import React from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";
import {
  GameVersion,
  IConfigRegion,
  IExpansion,
  IPricelistJson,
  IProfessionPricelistJson,
  IShortProfession,
} from "@sotah-inc/core";

import { IAuctionResultData } from "../../../../types/auction";
import { IClientRealm } from "../../../../types/global";
import { getItemFromPricelist } from "../../../../util";
import { ProfessionIcon } from "../../../util";
import { ItemIcon } from "../../../util/ItemIcon";

export interface IStateProps {
  auctionsResultData: IAuctionResultData;
  professions: IShortProfession[];
  expansions: IExpansion[];
  currentRealm: IClientRealm | null;
  currentRegion: IConfigRegion | null;
  currentGameVersion: GameVersion | null;
}

export interface IRouteProps {
  browseToExpansion: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
  ) => void;
  browseToProfession: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
  ) => void;
  browseToProfessionPricelist: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
    pricelist: IPricelistJson,
  ) => void;
}

export interface IOwnProps {
  professionPricelists: IProfessionPricelistJson[];
}

type Props = Readonly<IStateProps & IOwnProps & IRouteProps>;

export class RelatedProfessionPricelists extends React.Component<Props> {
  public render(): React.ReactNode {
    const { professionPricelists } = this.props;

    return professionPricelists.map((v, i) => this.renderProfessionPricelist(i, v));
  }

  private renderProfessionPricelist(index: number, professionPricelist: IProfessionPricelistJson) {
    const {
      expansions,
      professions,
      currentGameVersion,
      currentRegion,
      currentRealm,
      browseToProfessionPricelist,
      browseToExpansion,
      browseToProfession,
    } = this.props;

    if (currentGameVersion === null || currentRegion === null || currentRealm === null) {
      return null;
    }

    const expansion = expansions.reduce<IExpansion | null>((prev, v) => {
      if (prev !== null) {
        return prev;
      }

      if (v.name === professionPricelist.expansion) {
        return v;
      }

      return null;
    }, null);
    if (expansion === null) {
      return null;
    }

    const profession = professions.reduce<IShortProfession | null>((prev, v) => {
      if (prev !== null) {
        return prev;
      }

      if (v.id === professionPricelist.professionId) {
        return v;
      }

      return null;
    }, null);
    if (profession === null) {
      return null;
    }

    const boxShadow: string = index === 0 ? "none" : "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)";

    return (
      <tr className="related-profession-pricelists" key={index}>
        <td colSpan={3} style={{ boxShadow }}>
          <ButtonGroup>
            <Button
              rightIcon="chevron-right"
              minimal={true}
              small={true}
              onClick={() =>
                browseToExpansion(currentGameVersion, currentRegion, currentRealm, expansion)
              }
            >
              <span style={{ color: expansion.label_color }}>{expansion.label}</span>
            </Button>
            <Button
              rightIcon="chevron-right"
              minimal={true}
              small={true}
              onClick={() =>
                browseToProfession(
                  currentGameVersion,
                  currentRegion,
                  currentRealm,
                  expansion,
                  profession,
                )
              }
            >
              <ProfessionIcon profession={profession} /> {profession.name}
            </Button>
            <Button
              icon={this.renderPricelistIcon(professionPricelist.pricelist)}
              minimal={true}
              small={true}
              onClick={() =>
                browseToProfessionPricelist(
                  currentGameVersion,
                  currentRegion,
                  currentRealm,
                  expansion,
                  profession,
                  professionPricelist.pricelist,
                )
              }
            >
              {professionPricelist.pricelist.name}
            </Button>
          </ButtonGroup>
        </td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
      </tr>
    );
  }

  private renderPricelistIcon(list: IPricelistJson) {
    const {
      auctionsResultData: { items },
    } = this.props;

    const item = getItemFromPricelist(items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }
}
