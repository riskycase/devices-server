import { Flex, Link, Text, theme } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <Flex
      id="contact"
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
      gap={2}
      alignItems={{ base: "start", md: "center" }}
      justifyContent="space-evenly"
      padding={4}
      backgroundColor={theme.colors.gray[800]}
      position="sticky"
    >
      <Link as={NextLink} href="https://github.com/riskycase/devices-server">
        <Flex direction="row" alignItems="center" gap={1}>
          <FaGithub />
          <Text>Source Code</Text>
        </Flex>
      </Link>
    </Flex>
  );
}