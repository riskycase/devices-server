"use client";

import { signIn, signOut } from "@/actions";
import { signOut as nextSignOut, useSession } from "next-auth/react";
import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  theme,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import {
    MdAdminPanelSettings,
  MdArrowDropDown,
  MdDashboard,
  MdDevicesOther,
} from "react-icons/md";
import NextLink from "next/link";
import { Level, User } from "@prisma/client";

export default function Login({ user }: { user: User | null }) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  if (session.status === "loading") {
    return <Spinner />;
  } else if (session.status === "unauthenticated") {
    return (
      <Button
        isLoading={loading}
        onClick={() => {
          setLoading(true);
          signIn();
        }}
        leftIcon={<FaGoogle />}
      >
        SIGN IN
      </Button>
    );
  } else if (session.status === "authenticated" && session.data.user) {
    return (
      <Flex direction="row" alignItems="center" gap={2}>
        <Menu>
          <MenuButton>
            <Flex direction="row" alignItems="center" gap={2}>
              <Avatar
                name={session.data.user.name!}
                src={session.data.user.image!}
                size="sm"
              />
              <MdArrowDropDown />
            </Flex>
          </MenuButton>
          <MenuList textColor={theme.colors.gray[700]}>
            <MenuItem icon={<MdDashboard />} href={"/dashboard"} as={NextLink}>
              Dashboard
            </MenuItem>
            <MenuItem icon={<MdDevicesOther />} href={"/devices"} as={NextLink}>
              Manage Devices
            </MenuItem>{user?.level === Level.ADMIN && (
              <>
                <MenuItem
                  icon={<MdAdminPanelSettings />}
                  href={"/admin/dashboard"}
                  as={NextLink}
                >
                  Admin Dashboard
                </MenuItem>
                <MenuDivider />
              </>
            )}
            <MenuItem
              onClick={() => {
                signOut();
                nextSignOut({ redirect: false });
              }}
              icon={<FaSignOutAlt />}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }
}