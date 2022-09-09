import React from "react";
import "./card.css";

export default function Card(props) {
  const basePicUrl =
    "https://dweb.link/ipfs/bafybeifoqtxxlsv3bhycim2q6og27psv4eh3drpb3cyw35dsazobluvqae/";
  //ipfs://bafybeifk5gubhu3ggt2awyksch6fm4ftwcqiafdkk7qwbtalg7slikjiwa
  const projectName = "BellyVerse";

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
