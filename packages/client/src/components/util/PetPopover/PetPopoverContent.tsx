import React from "react";

import { IShortPet, PetQuality } from "@sotah-inc/core";

import { petQualityToColorClass } from "../../../util";

export interface IOwnProps {
  pet: IShortPet;
  quality: PetQuality;
  level: number;
}

type Props = Readonly<IOwnProps>;

export function PetPopoverContent({ pet, quality, level }: Props): JSX.Element {
  const petTextClass = petQualityToColorClass(quality);

  return (
    <div className="pet-popover-content">
      <div className="pure-g">
        <div className="pure-u-1-5">
          <p className={petTextClass} style={{ paddingBottom: "17px", marginBottom: 0 }}>
            <img src={pet.icon_url} className="pet-icon" alt="" />
          </p>
        </div>
        <div className="pure-u-4-5">
          <ul>
            <li className={petTextClass}>{pet.name}</li>
            <li className="pet-level">Pet level {level}</li>
            <li>Battle pet: {pet.type_name}</li>
            {pet.description && <li className="description">{pet.description}</li>}
          </ul>
          <hr />
          <ul>
            <li>Pet id: {pet.id}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
