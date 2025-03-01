"use client";

import { deleteDevice } from "@/actions";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  IconButton,
  Text,
  useBoolean,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { Device } from "@prisma/client";
import { redirect } from "next/navigation";
import { RefObject, useRef } from "react";
import { MdCheck, MdCopyAll } from "react-icons/md";

export default function DeviceDetail({ device }: { device: Device }) {
  const { onCopy: idCopy, hasCopied: idCopied } = useClipboard(device.id);
  const { onCopy: keyCopy, hasCopied: keyCopied } = useClipboard(
    device.secretKey
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement>;
  const [loading, setLoading] = useBoolean();
  return (
    <>
      <Flex direction="row" justifyContent="space-between">
        <Flex direction="column" gap={2}>
          <Text fontSize="large">{device.name}</Text>
          <Flex gap={1}>
            <Text>Device Id: {device.id}</Text>
            <IconButton
              icon={idCopied ? <MdCheck /> : <MdCopyAll />}
              aria-label="Copy device id"
              onClick={idCopy}
              variant="link"
              colorScheme="white"
            />
          </Flex>
          <Flex gap={1}>
            <Text>Device secret: {"●".repeat(16)}</Text>
            <IconButton
              icon={keyCopied ? <MdCheck /> : <MdCopyAll />}
              aria-label="Copy device secret"
              onClick={keyCopy}
              variant="link"
              colorScheme="white"
            />
          </Flex>
        </Flex>
        <Button colorScheme="red" onClick={onOpen}>
          Delete
        </Button>
      </Flex>{" "}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove {device.name} from your account?
            </AlertDialogHeader>
            <AlertDialogBody>
              Device {device.name} will be permanently deleted!
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={loading}
                onClick={async () => {
                  setLoading.on();
                  await deleteDevice(device);
                  setLoading.off();
                  onClose();
                  redirect("/devices");
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
