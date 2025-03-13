
import React from "react";
import { Stream } from "@/types/streams";

interface StreamItemProps {
  stream: Stream;
  isLastElement: boolean;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const StreamItem = ({ stream, isLastElement, lastElementRef }: StreamItemProps) => {
  return (
    <div
      ref={isLastElement ? lastElementRef : null}
      className="h-screen relative"
      style={{
        scrollSnapAlign: 'start',
      }}
    >
      <iframe
        src={`https://chaturbate.com/in/?tour=eQof&campaign=${stream.campaign}&track=default&signup_notice=1&b=${stream.room}`}
        className="w-full h-full border-none"
        allowFullScreen
        title={`Live Stream - ${stream.room}`}
      />
    </div>
  );
};

export default StreamItem;
