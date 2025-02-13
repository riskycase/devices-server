"use client";

import { createDevice } from "@/actions";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AddNewDeviceButton({
  addDisabled,
}: {
  addDisabled: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<FocusableElement>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useBoolean();
  return (
    <>
      <Button
        colorScheme="green"
        isDisabled={addDisabled}
        onClick={onOpen}
        rightIcon={<FaPlus />}
      >
        New
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add new device to account
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormControl isInvalid={name.length === 0}>
                <FormLabel>Device name</FormLabel>
                <Input
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
                <FormErrorMessage>Name cannot be blank</FormErrorMessage>
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                disabled={name.length === 0}
                isLoading={loading}
                onClick={async () => {
                  setLoading.on();
                  await createDevice(name);
                  setLoading.off();
                  onClose();
                  redirect("/devices");
                }}
                ml={3}
              >
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
