import React from "react";

import { PopoverInteractionKind } from "@blueprintjs/core";
import { Placement, Popover2 } from "@blueprintjs/popover2";
import { IShortPet, PetQuality } from "@sotah-inc/core";

import { PetLink } from "./PetLink";
import { PetPopoverContent } from "./PetPopover/PetPopoverContent";

export interface IOwnProps {
  pet: IShortPet;
  quality: PetQuality;
  level: number;

  onPetClick?: () => void;
  placement?: Placement;
  interactive?: boolean;
}

type Props = Readonly<IOwnProps>;

export class PetPopover extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    onPetClick: () => {
      return;
    },
  };

  public render(): React.ReactNode {
    const { pet, placement, interactive, onPetClick, quality, level } = this.props;

    return (
      <Popover2
        content={<PetPopoverContent level={level} pet={pet} quality={quality} />}
        interactionKind={PopoverInteractionKind.HOVER}
        placement={placement ?? "right"}
      >
        <PetLink pet={pet} interactive={interactive} onPetClick={onPetClick} level={level} />
      </Popover2>
    );
  }
}
