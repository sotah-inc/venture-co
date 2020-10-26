import React from "react";

import { IShortPet, PetQuality } from "@sotah-inc/core";

import { petQualityToColorClass } from "../../../util";

export function PetPopoverContent({ pet, quality }: { pet: IShortPet; quality: PetQuality }) {
  const itemTextClass = petQualityToColorClass(quality);

  return (
    <div className="item-popover-content">
      <div className="pure-g">
        <div className="pure-u-1-5">
          <p className={itemTextClass} style={{ paddingBottom: "17px", marginBottom: 0 }}>
            <img src={pet.icon_url} className="item-icon" alt="" />
          </p>
        </div>
        <div className="pure-u-4-5">
          <ul>
            <li className={itemTextClass}>{pet.name}</li>
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
