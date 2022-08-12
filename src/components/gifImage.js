import React from "react";
import { Image } from "react-konva";
import "gifler";

export default function GifImage(props) {
  const imageUrl = props.src;
  const imageRef = React.useRef(null);
  const canvas = React.useMemo(() => {
    const node = document.createElement("canvas");
    return node;
  }, []);

  React.useEffect(() => {
    let anim;
    window.gifler(imageUrl).get((a) => {
      anim = a;
      anim.animateInCanvas(canvas);
      anim.onDrawFrame = (ctx, frame) => {
        ctx.drawImage(frame.buffer, frame.x, frame.y);
        imageRef.current.getLayer().draw();
      };
    });
    return () => anim.stop();
  }, [imageUrl, canvas]);

  return (
    <Image
      image={canvas}
      ref={imageRef}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  );
}
