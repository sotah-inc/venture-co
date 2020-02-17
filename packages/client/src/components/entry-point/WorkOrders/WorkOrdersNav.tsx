import React from "react";

import { Alignment, Navbar, NavbarDivider, NavbarGroup } from "@blueprintjs/core";
import { IRegion, IStatusRealm, SortPerPage } from "@sotah-inc/core";

import { Pagination } from "../../util";
import { CountToggle } from "../../util/CountToggle";

export interface IStateProps {
  perPage: SortPerPage;
  totalResults: number;
  currentPage: number;
}

export interface IDispatchProps {
  setPerPage: (perPage: SortPerPage) => void;
  setPage: (page: number) => void;
}

export interface IRouteProps {
  browseTo: (region: IRegion, realm: IStatusRealm) => void;
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
      </Navbar>
    );
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
