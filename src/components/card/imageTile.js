import React from "react";

export default function Card(props) {
  const basePicUrl =
    "https://dweb.link/ipfs/bafybeifoqtxxlsv3bhycim2q6og27psv4eh3drpb3cyw35dsazobluvqae/";
  //ipfs://bafybeifk5gubhu3ggt2awyksch6fm4ftwcqiafdkk7qwbtalg7slikjiwa
  const projectName = "BellyVerse";

  const imageUrl = basePicUrl + props.id + ".png";
  return <img src={imageUrl} alt="example" width="100px" />;
}
