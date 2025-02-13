import { getUser } from "@/actions";
import { Flex, Heading, Text } from "@chakra-ui/react";

export default async function Dashboard() {
  const [user] = await Promise.all([getUser()]);
  return user ? (
    <></>
  ) : (
    <Flex direction="column" padding={4} width="100%" gap={4} flex={1} className="h-full">
      <Heading>Dashboard</Heading>
      <Text>You must be signed in to view the dashboard!</Text>
    </Flex>
  );
}
