"use client";

import { SendCommandFunction } from "@/types";
import {
  Card,
  CardBody,
  Flex,
  IconButton,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  MdPause,
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import PauseMarquee from "../components/PauseMarquee";

type MusicPlayerState = {
  title: string;
  album?: string;
  artist?: string;
  playerName?: string;
  position: number;
  duration: number;
  updatedAt: number;
  playingState: PLAYING_STATE;
};

enum PLAYING_STATE {
  BUFFERING = 6,
  CONNECTING = 8,
  ERROR = 7,
  FAST_FORWARDING = 4,
  NONE = 0,
  PAUSED = 2,
  PLAYING = 3,
  REWINDING = 5,
  SKIPPING_TO_NEXT = 10,
  SKIPPING_TO_PREV = 9,
  SKIPPING_TO_QUEUE = 11,
  SKIPPING_TO_STOPPED = 1,
}

function MusicPlayer({
  musicDetails,
  artBase64,
  sendCommand,
}: {
  musicDetails: MusicPlayerState;
  artBase64: string;
  sendCommand: SendCommandFunction;
}) {
  const [milliseconds, setMilliseconds] = useState(Date.now());
  const [seeking, setSeeking] = useState(false);
  const [currentSeek, setCurrentSeek] = useState(0);
  useEffect(() => {
    const updater = setInterval(() => setMilliseconds(Date.now()), 100);
    return () => {
      clearInterval(updater);
    };
  }, []);
  const startTime = musicDetails.updatedAt - musicDetails.position;
  const endTime = startTime + musicDetails.duration;
  const durationNow =
    Number(musicDetails.position) +
    (musicDetails.playingState == PLAYING_STATE.PLAYING
      ? milliseconds - Number(musicDetails.updatedAt)
      : 0);
  const startLabel = `${Math.floor(durationNow / 60000)}:${Math.floor(
    (durationNow % 60000) / 1000,
  )
    .toString()
    .padStart(2, "0")}`;
  const endLabel = `${Math.floor(musicDetails.duration / 60000)}:${Math.floor(
    (musicDetails.duration / 1000) % 60,
  )
    .toString()
    .padStart(2, "0")}`;
  return (
    <Card>
      <CardBody>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={4}
          alignItems="stretch"
        >
          <Image
            aspectRatio={1}
            src={`data:image/png;base64,${artBase64}`}
            height="12rem"
            objectFit="contain"
            alt={`Album art for ${musicDetails.title}`}
            maxWidth="70vw"
            alignSelf="center"
          />
          <Flex direction="column" gap={2} flex={1}>
            <PauseMarquee>
              <Text fontSize="larger" noOfLines={1} marginRight={2}>
                {musicDetails.title}
              </Text>
            </PauseMarquee>
            <PauseMarquee>
              <Text fontStyle="italic" noOfLines={1} marginRight={2}>
                {musicDetails.album && `from ${musicDetails.album} `}
                {musicDetails.artist && `by ${musicDetails.artist}`}
              </Text>
            </PauseMarquee>
            <Slider
              min={0}
              max={endTime - startTime}
              value={seeking ? currentSeek : durationNow}
              onChangeEnd={(seekToDurarion) => {
                sendCommand(`seekTo=:=${seekToDurarion}`);
                setSeeking(false);
              }}
              onChange={setCurrentSeek}
              onChangeStart={(seekStart) => {
                setCurrentSeek(seekStart);
                setSeeking(true);
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Flex direction="row" justifyContent="space-between">
              <Text>{startLabel}</Text>
              <Text>{endLabel}</Text>
            </Flex>
            <Flex direction="row" justifyContent="space-around">
              <IconButton
                icon={<MdSkipPrevious />}
                aria-label="Music previous"
                onClick={() => sendCommand("prev")}
              />
              <IconButton
                icon={
                  musicDetails.playingState == PLAYING_STATE.PLAYING ? (
                    <MdPause />
                  ) : (
                    <MdPlayArrow />
                  )
                }
                onClick={() =>
                  sendCommand(
                    musicDetails.playingState == PLAYING_STATE.PLAYING
                      ? "pause"
                      : "play",
                  )
                }
                aria-label="Music play/pause"
              />
              <IconButton
                icon={<MdSkipNext />}
                aria-label="Music next"
                onClick={() => sendCommand("next")}
              />
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}

export default function MusicDetails({
  detailsString,
  albumArtsString,
  sendCommand,
}: {
  detailsString: string | undefined;
  albumArtsString: string | undefined;
  sendCommand: SendCommandFunction;
}) {
  if (detailsString && albumArtsString) {
    const musicDetails = JSON.parse(detailsString);
    const players = Object.keys(musicDetails).filter((player) => {
      const playerInfo = JSON.parse(musicDetails[player]) as MusicPlayerState;
      return (
        playerInfo.title &&
        playerInfo.duration &&
        playerInfo.position &&
        playerInfo.updatedAt &&
        playerInfo.playerName
      );
    });
    const musicPlayers = players.map(
      (player) => JSON.parse(musicDetails[player]) as MusicPlayerState,
    );
    const albumArts = JSON.parse(albumArtsString);
    return players.length > 0 ? (
      <Flex direction="column" alignItems="stretch" gap={2}>
        <Text fontSize="xx-large">Currently playing</Text>
        <Tabs>
          <TabList>
            {players.map((player, index) => (
              <Tab key={index}>
                {
                  (JSON.parse(musicDetails[player]) as MusicPlayerState)
                    .playerName
                }
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {musicPlayers.map((player, index) => (
              <TabPanel key={index}>
                <MusicPlayer
                  musicDetails={player}
                  artBase64={albumArts[players[index]]}
                  sendCommand={(commandContent: string) =>
                    sendCommand(`${players[index]}=:=${commandContent}`)
                  }
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Flex>
    ) : (
      <></>
    );
  } else return <></>;
}
