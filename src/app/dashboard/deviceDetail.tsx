import { SocketDetails } from "@/types";
import { Flex, Text } from "@chakra-ui/react";
import { Device } from "@prisma/client";
import BatteryDetails from "./channelParsers/batteryDetail";
import MusicDetails from "./channelParsers/musicDetail";

export default function DeviceDetail({
  device,
  socketDetails,
}: {
  device: Device;
  socketDetails?: SocketDetails;
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
        <BatteryDetails detailsString={socketDetails?.batteryDetails} />
      </Flex>
      <Flex direction="column" gap={2}>
        <MusicDetails
          detailsString={socketDetails?.musicDetails}
          albumArtsString={socketDetails?.albumArtDetails}
        />
      </Flex>
    </Flex>
  );
}
