"use server";

import { getUser } from "@/actions";
import { getDevicesForUser } from "@/actions/devices";
import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import AddNewDeviceButton from "./addButton";
import DeviceDetail from "./deviceDetail";

export default async function DeviceManager() {
  const [user, devices] = await Promise.all([getUser(), getDevicesForUser()]);
  return user ? (
    devices.responseCode === "SUCCESS" ? (
      <Flex
        direction="column"
        padding={4}
        width="100%"
        gap={4}
        flex={1}
        key={`devices${devices.responseCode}`}
      >
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading>Device Manager</Heading>
          <AddNewDeviceButton
            addDisabled={user!.deviceLimit <= devices.result.length}
          />
        </Flex>
        {user!.deviceLimit <= devices.result.length && (
          <Alert status="warning" variant="solid">
            <AlertIcon />
            You have reached the maximum number of devices for this account!
          </Alert>
        )}
        <Text>
          Using {devices.result.length} device
          {devices.result.length === 1 ? "" : "s"} out of {user!.deviceLimit}
        </Text>
        {devices.result.map((device, index) => (
          <>
            {index !== 0 && <Divider />}
            <DeviceDetail device={device} key={index} />
          </>
        ))}
      </Flex>
    ) : (
      <Flex
        direction="column"
        padding={4}
        width="100%"
        gap={4}
        flex={1}
        className="h-full"
        key={`devices${devices.responseCode}`}
      >
        <Heading>Device Manager</Heading>
        <Text>Could not fetch devices!</Text>
      </Flex>
    )
  ) : (
    <Flex
      direction="column"
      padding={4}
      width="100%"
      gap={4}
      flex={1}
      className="h-full"
    >
      <Heading>Device Manager</Heading>
      <Text>You must be signed in to view the dashboard!</Text>
    </Flex>
  );
}
