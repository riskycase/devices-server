"use client";

import { socket } from "@/socket";
import { SocketMap } from "@/types";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const session = useSession();
  const [listener, setListener] = useState(socket);
  const [devicesState, setDevicesState] = useState<SocketMap>({});

  useEffect(() => {
    if (session.status === "authenticated") {
      listener.auth = {
        sessionToken: session.data.sessionToken,
        userId: session.data.userId,
      };
      listener.on("init", (message) => {
        setDevicesState(JSON.parse(message));
      });
      listener.onAny((channel, message) => {
        if (channel === "init") return;
        const messageJSON = JSON.parse(message);
        const deviceId = messageJSON.deviceId;
        setDevicesState((devicesState) => {
          if (channel.startsWith("delta.")) {
            devicesState[deviceId][channel.replace("delta.", "")] =
              JSON.stringify({
                ...JSON.parse(
                  devicesState[deviceId][channel.replace("delta.", "")] || "{}"
                ),
                ...JSON.parse(messageJSON.body),
              });
          } else {
            devicesState[deviceId][channel] = messageJSON.body;
          }
          return devicesState;
        });
      });
      listener.connect();
      setListener(listener);
    }
  }, [session.status]);
  return session.data?.user ? (
    <></>
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
