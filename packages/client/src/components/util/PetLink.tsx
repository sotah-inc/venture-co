import React from "react";

import { IShortPet } from "@sotah-inc/core";

export interface IOwnProps {
  pet: IShortPet;
  level: number;

  onPetClick?: () => void;
  interactive?: boolean;
}

type Props = Readonly<IOwnProps>;

export class PetLink extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    onPetClick: () => {
      return;
    },
  };

  public render(): React.ReactNode {
    const { pet } = this.props;

    return <div className="pet">{this.renderDisplay(pet)}</div>;
  }

  private onPetClick() {
    const { onPetClick } = this.props;
    if (!onPetClick) {
      return;
    }

    onPetClick();
  }

  private renderDisplay(pet: IShortPet) {
    return (
      <>
        <img src={pet.icon_url} className="pet-icon" alt="" /> {this.renderLink(pet)}
      </>
    );
  }

  private renderLink(pet: IShortPet) {
    const { interactive, level } = this.props;

    if (typeof interactive === "undefined" || interactive) {
      return (
        <a onClick={() => this.onPetClick()}>
          {pet.name} ({level})
        </a>
      );
    }

    return `${pet.name} (${level})`;
  }
}
