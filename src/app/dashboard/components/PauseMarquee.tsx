"use client";

import { useState } from "react";
import Marquee from "react-fast-marquee";

export default function PauseMarquee({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [playing, setPlaying] = useState(true);
  return (
    <Marquee
      play={playing}
      onCycleComplete={() => {
        setPlaying(false);
        setTimeout(() => setPlaying(true), 5000);
      }}
    >
      {children}
    </Marquee>
  );
}
