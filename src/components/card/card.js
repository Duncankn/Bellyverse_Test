import React from "react";
import "./card.css";

export default function Card(props) {
  const basePicUrl =
    "https://dweb.link/ipfs/QmTB3d5hkv3gEa7K9BvDpvgYfwGXu7PfcLuhCVgXtbMwAP/";
  const projectName = "The Art";

  const imageUrl = basePicUrl + props.id + ".png";
  return (
    <div className="card__box">
      <img className="card__image" src={imageUrl} alt="example" />
      <h2 className="card__name">
        {projectName} # {props.id}
      </h2>
    </div>
  );
}
