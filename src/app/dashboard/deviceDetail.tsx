import { SendCommandFunction, SocketDetails } from "@/types";
import { Flex, Text } from "@chakra-ui/react";
import { Device } from "@prisma/client";
import BatteryDetails from "./channelParsers/batteryDetail";
import MusicDetails from "./channelParsers/musicDetail";

export default function DeviceDetail({
  device,
  socketDetails,
  sendCommand,
}: {
  device: Device;
  socketDetails?: SocketDetails;
  sendCommand: SendCommandFunction;
}) {
  return (
    <Flex
      direction="column"
      gap={2}
      alignItems="stretch"
      borderWidth="1px"
      rounded="md"
      padding={{ base: 2, lg: 4 }}
    >
      <Flex direction="row" justifyContent="space-between">
        <Text fontSize="larger">{device.name}</Text>
        {socketDetails ? (
          <BatteryDetails
            detailsString={socketDetails?.channels.batteryDetails}
          />
        ) : (
          <Text fontStyle="italic">Disconnected</Text>
        )}
      </Flex>
      {socketDetails ? (
        <Flex direction="column" gap={2}>
          <MusicDetails
            detailsString={socketDetails?.channels.musicDetails}
            albumArtsString={socketDetails?.channels.albumArtDetails}
            sendCommand={(commandContent: string) =>
              sendCommand(`${device.id}=:=music=:=${commandContent}`)
            }
          />
        </Flex>
      ) : (
        <></>
      )}
    </Flex>
  );
}
