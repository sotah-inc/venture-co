import { IExpansion } from "@sotah-inc/core";
import { connect } from "react-redux";

import { ExpansionToggle, IOwnProps, IStateProps } from "../../components/util/ExpansionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentGameVersion, bootData: { data: { version_meta } } } = state.Main;
  const { selectedExpansion } = state.PriceLists;

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
    selectedExpansion,
    expansions,
  };
}

export const ExpansionToggleContainer = connect<IStateProps, Record<string, unknown>, IOwnProps>(
  mapStateToProps,
)(ExpansionToggle);
