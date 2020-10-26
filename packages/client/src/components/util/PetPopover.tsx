import React from "react";

import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { IShortPet, PetQuality } from "@sotah-inc/core";

import { PetLink } from "./PetLink";
import { PetPopoverContent } from "./PetPopover/PetPopoverContent";

export interface IOwnProps {
  pet: IShortPet;
  quality: PetQuality;

  onPetClick?: () => void;
  position?: Position;
  interactive?: boolean;
}

type Props = Readonly<IOwnProps>;

export class PetPopover extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    onPetClick: () => {
      return;
    },
  };

  public render() {
    const { pet, position, interactive, onPetClick, quality } = this.props;

    return (
      <Popover
        content={<PetPopoverContent pet={pet} quality={quality} />}
        target={<PetLink pet={pet} interactive={interactive} onPetClick={onPetClick} />}
        interactionKind={PopoverInteractionKind.HOVER}
        position={position ?? Position.RIGHT}
      />
    );
  }
}
