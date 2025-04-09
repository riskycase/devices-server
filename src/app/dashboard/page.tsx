"use client";

import { getDevicesForUser } from "@/actions/devices";
import { socket } from "@/socket";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { Device } from "@prisma/client";
import { UpdateSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DeviceDetail from "./deviceDetail";
import { Session } from "next-auth";
import ScreenWakeLock from "./screenWakelock";

export default function Dashboard() {
  const session = useSession() as {
    update: UpdateSession;
    data: Session & { sessionToken: string; userId: string };
    status: string;
  };
  const [devices, setDevices] = useState<Array<Device>>([]);
  const [listener, setListener] = useState(socket);
  const [devicesState, setDevicesState] = useState<string>("{}");

  function sendCommand(commandString: string) {
    listener.emit("command", commandString);
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      getDevicesForUser().then((response) => {
        if (response.responseCode === "SUCCESS") {
          setDevices(response.result);
        }
      });
      listener.auth = {
        sessionToken: session.data.sessionToken,
        userId: session.data.userId,
      };
      listener.on("init", (message) => {
        setDevicesState(message);
      });
      listener.onAny((channel, message) => {
        if (channel === "init") return;
        const messageJSON = JSON.parse(message);
        const deviceId = messageJSON.deviceId;
        if (channel === "deviceDisconnect") {
          const devicesStateJSON = JSON.parse(devicesState);
          delete devicesStateJSON[deviceId];
          setDevicesState(JSON.stringify(devicesStateJSON));
          return;
        }
        setDevicesState((devicesState) => {
          const devicesStateJSON = JSON.parse(devicesState);
          if (
            devicesStateJSON[deviceId] &&
            devicesStateJSON[deviceId].channels
          ) {
            if (channel.startsWith("delta.")) {
              devicesStateJSON[deviceId].channels[
                channel.replace("delta.", "")
              ] = JSON.stringify({
                ...JSON.parse(
                  devicesStateJSON[deviceId].channels[
                    channel.replace("delta.", "")
                  ] || "{}",
                ),
                ...JSON.parse(messageJSON.body),
              });
            } else {
              devicesStateJSON[deviceId].channels[channel] = messageJSON.body;
            }
          }
          return JSON.stringify(devicesStateJSON);
        });
      });
      listener.connect();
      setListener(listener);
    }
  }, [session.status]);
  return session.data?.user ? (
    <Flex
      direction="column"
      padding={4}
      width="100%"
      gap={4}
      flex={1}
      className="h-full"
    >
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <Heading>Dashboard</Heading>
        <ScreenWakeLock />
      </Flex>
      <Flex direction="column" gap={{ base: 1, lg: 2 }}>
        {devices.map((device) => (
          <DeviceDetail
            key={device.id}
            device={device}
            socketDetails={JSON.parse(devicesState)[device.id]}
            sendCommand={sendCommand}
          />
        ))}
      </Flex>
    </Flex>
  ) : (
    <Flex
      direction="column"
      padding={4}
      width="100%"
      gap={4}
      flex={1}
      className="h-full"
    >
      <Heading>Dashboard</Heading>
      <Text>You must be signed in to view the dashboard!</Text>
    </Flex>
  );
}
