"use client";

import { Flex, Heading, Text } from "@chakra-ui/react";
import TextTransition, { presets } from "react-text-transition";
import { useEffect, useState } from "react";

export default function AnimatedText() {
  const linkData = [
    "check battery level",
    "check notifications",
    "control music playback",
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => (index + 1) % linkData.length),
      5000 // every 5 seconds
    );
    return () => clearTimeout(intervalId);
  }, [linkData.length]);
  return (
    <Flex
      padding={4}
      direction="column"
      alignItems="center"
      gap={1}
      minWidth="min(28rem, 100%)"
      maxWidth="100%"
    >
      <Heading as={"h1"} fontSize="xx-large" alignSelf="center" marginY={4}>
        Connected devices
      </Heading>
      <Text fontSize="larger">One stop dashboard to</Text>
      <TextTransition springConfig={presets.wobbly}>
        <Text noOfLines={1} fontSize="larger">
          {linkData[index]}
        </Text>
      </TextTransition>
      <Text fontSize="larger">across multiple devices</Text>
    </Flex>
  );
}
