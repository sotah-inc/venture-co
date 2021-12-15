import { IExpansion } from "@sotah-inc/core";
import { connect } from "react-redux";

import {
  RelatedProfessionPricelists,
  IStateProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import { IStoreState } from "../../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    regionData,
    currentRealm,
    currentRegion,
    currentGameVersion,
    bootData: {
      data: { version_meta },
    },
  } = state.Main;
  const {
    auctionsResult: { data: auctionsResultData },
  } = state.Auction;

  const expansions = ((): IExpansion[] => {
    if (currentGameVersion === null) {
      return [];
    }

    const foundMeta = version_meta.find(v => v.name === currentGameVersion);
    if (foundMeta === undefined) {
      return [];
    }

    return foundMeta.expansions;
  })();

  return {
    auctionsResultData,
    currentRealm,
    currentRegion,
    currentGameVersion,
    professions: regionData.data.professions,
    expansions,
  };
}

export const RelatedProfessionPricelistsContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(RelatedProfessionPricelists);
