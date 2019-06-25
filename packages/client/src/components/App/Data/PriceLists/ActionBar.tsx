import * as React from "react";

import {
    Alignment,
    Button,
    ButtonGroup,
    Classes,
    Intent,
    Navbar,
    NavbarGroup,
    Position,
    Spinner,
    Tooltip,
} from "@blueprintjs/core";
import { RouteComponentProps } from "react-router";

import { IPricelistJson, UserLevel } from "@app/api-types/entities";
import { IExpansion } from "@app/api-types/expansion";
import { IProfession } from "@app/api-types/profession";
import { IRealm, IRegion } from "@app/api-types/region";
import { RealmToggleContainer } from "@app/containers/util/RealmToggle";
import { RegionToggleContainer } from "@app/containers/util/RegionToggle";
import { IProfile } from "@app/types/global";
import { AuthLevel } from "@app/types/main";

export interface IStateProps {
    currentRegion: IRegion | null;
    currentRealm: IRealm | null;
    isAddListDialogOpen: boolean;
    isAddEntryDialogOpen: boolean;
    selectedList: IPricelistJson | null;
    selectedProfession: IProfession | null;
    authLevel: AuthLevel;
    profile: IProfile | null;
    selectedExpansion: IExpansion | null;
}

export interface IDispatchProps {
    changeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
    changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void;
    changeIsEditListDialogOpen: (isDialogOpen: boolean) => void;
    changeIsDeleteListDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IOwnProps extends RouteComponentProps<{}> {}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class ActionBar extends React.Component<Props> {
    public render() {
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>{this.renderButtons()}</NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <ButtonGroup>
                        <RealmToggleContainer onRealmChange={(v: IRealm) => this.onRealmChange(v)} />
                        <RegionToggleContainer />
                    </ButtonGroup>
                </NavbarGroup>
            </Navbar>
        );
    }

    private onRealmChange(realm: IRealm) {
        const { history, currentRegion, selectedProfession, selectedList, selectedExpansion } = this.props;

        if (currentRegion === null) {
            return;
        }

        const urlParts = ["data", currentRegion.name, realm.slug, "professions"];
        if (selectedProfession === null) {
            if (selectedList !== null && selectedList.slug !== null) {
                urlParts.push(...["user", selectedList.slug]);
            }
        } else {
            urlParts.push(selectedProfession.name);

            if (selectedExpansion !== null) {
                urlParts.push(selectedExpansion.name);
            }
            if (selectedList !== null && selectedList.slug !== null) {
                urlParts.push(selectedList.slug);
            }
        }
        history.push(`/${urlParts.join("/")}`);
    }

    private renderListButtons() {
        const {
            authLevel,
            selectedList,
            changeIsAddEntryDialogOpen,
            changeIsDeleteListDialogOpen,
            changeIsEditListDialogOpen,
            selectedProfession,
            profile,
        } = this.props;

        let canMutateEntry = authLevel === AuthLevel.authenticated && selectedList !== null;
        if (selectedProfession !== null && profile !== null && profile.user.level !== UserLevel.Admin) {
            canMutateEntry = false;
        }

        return (
            <>
                <Navbar.Divider />
                <Button
                    icon="plus"
                    onClick={() => changeIsAddEntryDialogOpen(true)}
                    text="Entry"
                    disabled={!canMutateEntry}
                />
                <Navbar.Divider />
                <ButtonGroup>
                    <Button icon="edit" onClick={() => changeIsEditListDialogOpen(true)} disabled={!canMutateEntry} />
                    <Button
                        icon="delete"
                        onClick={() => changeIsDeleteListDialogOpen(true)}
                        text="Delete"
                        disabled={!canMutateEntry}
                    />
                </ButtonGroup>
            </>
        );
    }

    private renderAddListButton() {
        const { changeIsAddListDialogOpen, selectedProfession, authLevel, profile } = this.props;

        let createListText = "List";
        if (selectedProfession !== null) {
            createListText = `${selectedProfession.label} List`;
        }

        if (authLevel === AuthLevel.unauthenticated || profile === null) {
            return <Button icon="plus" text={createListText} disabled={true} />;
        }

        if (selectedProfession !== null && profile.user.level !== UserLevel.Admin) {
            return (
                <Tooltip content="You are not authorized to manage profession pricelists!" position={Position.RIGHT}>
                    <Button icon="plus" text={createListText} disabled={true} />
                </Tooltip>
            );
        }

        return <Button icon="plus" onClick={() => changeIsAddListDialogOpen(true)} text={createListText} />;
    }

    private renderButtons() {
        const { currentRegion, currentRealm } = this.props;

        if (currentRegion === null || currentRealm === null) {
            return <Spinner className={Classes.SMALL} intent={Intent.NONE} value={0} />;
        }

        return (
            <>
                {this.renderAddListButton()}
                {this.renderListButtons()}
            </>
        );
    }
}
