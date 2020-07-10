import React from "react";

import { Alignment, ButtonGroup, Navbar, NavbarDivider, NavbarGroup } from "@blueprintjs/core";
import { IRegionComposite, SortPerPage } from "@sotah-inc/core";

import { RealmToggleContainer } from "../../../containers/util/RealmToggle";
import { RegionToggleContainer } from "../../../containers/util/RegionToggle";
import { IClientRealm } from "../../../types/global";
import { Pagination } from "../../util";
import { CountToggle } from "../../util/CountToggle";

export interface IStateProps {
  perPage: SortPerPage;
  totalResults: number;
  currentPage: number;
  currentRegion: IRegionComposite | null;
}

export interface IDispatchProps {
  setPerPage: (perPage: SortPerPage) => void;
  setPage: (page: number) => void;
}

export interface IRouteProps {
  browseTo: (region: IRegionComposite, realm: IClientRealm) => void;
}

type Props = Readonly<IDispatchProps & IStateProps & IRouteProps>;

export class WorkOrdersNav extends React.Component<Props> {
  public render() {
    const { perPage, setPerPage, setPage, currentPage } = this.props;

    return (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <CountToggle perPage={perPage} onCountChange={setPerPage} />
          <NavbarDivider />
          <Pagination
            currentPage={currentPage}
            pageCount={this.getPageCount()}
            pagesShown={5}
            onPageChange={setPage}
          />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <ButtonGroup>
            <RealmToggleContainer onRealmChange={(v: IClientRealm) => this.onRealmChange(v)} />
            <RegionToggleContainer />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }

  private onRealmChange(realm: IClientRealm) {
    const { browseTo, currentRegion } = this.props;

    if (currentRegion === null) {
      return;
    }

    browseTo(currentRegion, realm);
  }

  private getPageCount() {
    const { totalResults, perPage } = this.props;

    let pageCount = 0;
    if (totalResults > 0) {
      pageCount = totalResults / perPage - 1;
      const remainder = totalResults % perPage;
      if (remainder > 0) {
        pageCount = (totalResults - remainder) / perPage;
      }
    }

    return pageCount;
  }
}
