import React from "react";
import { Label, Tag, Text } from "react-konva";

export default function Tooltip(props) {
  return (
    <Label x={props.x} y={props.y} opacity="0.75" visible={props.isVisible}>
      <Tag
        fill="black"
        pointerDirection="down"
        pointerWidth="0"
        lineJoin="round"
        shadowColor="black"
        shadowBlur="10"
        shadowOffsetX="10"
        shadowOffsetY="10"
        shadowOpacity="10"
      />
      <Text
        text={props.text}
        fontFamily="Press Start 2P"
        fontSize="16"
        padding="5"
        fill="white"
      />
    </Label>
  );
}
