import * as React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { Redirect, RouteComponentProps } from "react-router-dom";

import { IRealm, IRegion } from "@app/api-types/region";
import { IRegions } from "@app/types/global";
import { AuthLevel, FetchLevel } from "@app/types/main";

export interface IStateProps {
    currentRegion: IRegion | null;
    currentRealm: IRealm | null;
    authLevel: AuthLevel;
    regions: IRegions;
    fetchRealmLevel: FetchLevel;
}

export interface IDispatchProps {
    onRegionChange: (region: IRegion) => void;
    fetchRealms: (region: IRegion) => void;
}

interface IRouteProps {
    region_name: string;
}

export interface IOwnProps extends RouteComponentProps<IRouteProps> {}

export type Props = Readonly<IOwnProps & IStateProps & IDispatchProps>;

export class Region extends React.Component<Props> {
    public componentDidMount() {
        const {
            match: {
                params: { region_name },
            },
            regions,
            currentRegion,
            onRegionChange,
            fetchRealms,
            fetchRealmLevel,
        } = this.props;

        if (!(region_name in regions)) {
            return;
        }

        if (currentRegion === null) {
            onRegionChange(regions[region_name]);

            return;
        }

        if (currentRegion.name !== region_name) {
            onRegionChange(regions[region_name]);

            return;
        }

        switch (fetchRealmLevel) {
            case FetchLevel.initial:
                fetchRealms(currentRegion);

                return;
            default:
                return;
        }
    }

    public componentDidUpdate(prevProps: Props) {
        const {
            currentRegion,
            match: {
                params: { region_name },
            },
            fetchRealmLevel,
            fetchRealms,
        } = this.props;

        if (currentRegion === null) {
            return;
        }

        if (currentRegion.name !== region_name) {
            return;
        }

        switch (fetchRealmLevel) {
            case FetchLevel.initial:
                fetchRealms(currentRegion);

                return;
            case FetchLevel.prompted:
                if (prevProps.fetchRealmLevel === fetchRealmLevel) {
                    return;
                }

                fetchRealms(currentRegion);

                return;
            default:
                return;
        }
    }

    public render() {
        const {
            currentRegion,
            match: {
                params: { region_name },
            },
        } = this.props;

        if (currentRegion === null || currentRegion.name !== region_name) {
            return this.renderUnmatched();
        }

        return this.renderMatched();
    }

    private renderMatched() {
        const { fetchRealmLevel } = this.props;

        switch (fetchRealmLevel) {
            case FetchLevel.prompted:
            case FetchLevel.fetching:
            case FetchLevel.refetching:
                return (
                    <NonIdealState
                        title="Loading realms"
                        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
                    />
                );
            case FetchLevel.failure:
                return (
                    <NonIdealState
                        title="Failed to load realms"
                        icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
                    />
                );
            case FetchLevel.success:
                return this.renderMatchedWithRealms();
            case FetchLevel.initial:
            default:
                return (
                    <NonIdealState
                        title="Loading realms"
                        icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
                    />
                );
        }
    }

    private renderMatchedWithRealms() {
        const { currentRealm, currentRegion } = this.props;

        if (currentRegion === null || currentRealm === null) {
            return (
                <NonIdealState
                    title="No region or realm!"
                    icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
                />
            );
        }

        return <Redirect to={`/data/${currentRegion.name}/${currentRealm.slug}`} />;
    }

    private renderUnmatched() {
        const {
            regions,
            match: {
                params: { region_name },
            },
        } = this.props;

        if (!(region_name in regions)) {
            return (
                <NonIdealState
                    title={`Region ${region_name} not found!`}
                    icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
                />
            );
        }

        return (
            <NonIdealState title="Changing region" icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />} />
        );
    }
}
