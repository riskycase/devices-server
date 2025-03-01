"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { ApiResponse, EmptyApiResponse } from "@/types";
import { Device } from "@prisma/client";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

export async function createDevice(name: string): Promise<ApiResponse<Device>> {
  const user = await auth();
  if (!user || !user.user || !user.user.id) {
    return {
      responseCode: "UNAUTHENTICATED",
    };
  }
  const secret = randomBytes(16).toString("hex");
  try {
    const [currentUser, existingDevices] = await Promise.all([
      db.user.findFirstOrThrow({ where: { id: user.user.id } }),
      db.device.findMany({ where: { userId: user.user.id } }),
    ]);
    if (existingDevices.length >= currentUser.deviceLimit) {
      return {
        responseCode: "FORBIDDEN",
      };
    }
    await db.device.create({
      data: {
        name,
        secretKey: secret,
        userId: user.user.id,
      },
    });
    redirect("/devices");
  } catch (e: unknown) {
    console.trace(e);
    return {
      responseCode: "DBERROR",
    };
  }
}

export async function getDevice(
  deviceId: string,
  secret: string
): Promise<ApiResponse<Device>> {
  try {
    const device = await db.device.findFirst({ where: { id: deviceId } });
    if (device?.secretKey == secret) {
      return {
        responseCode: "SUCCESS",
        result: device,
      };
    } else {
      return {
        responseCode: "UNAUTHORISED",
      };
    }
  } catch (e: unknown) {
    console.trace(e);
    return {
      responseCode: "DBERROR",
    };
  }
}

export async function getDevicesForUser(): Promise<ApiResponse<Array<Device>>> {
  const user = await auth();
  if (!user || !user.user) {
    return {
      responseCode: "UNAUTHENTICATED",
    };
  }
  try {
    const devices = await db.device.findMany({
      where: { userId: user.user.id },
    });
    return {
      responseCode: "SUCCESS",
      result: devices,
    };
  } catch (e: unknown) {
    console.trace(e);
    return {
      responseCode: "DBERROR",
    };
  }
}

export async function deleteDevice(device: Device): Promise<EmptyApiResponse> {
  const user = await auth();
  if (!user || !user.user) {
    return {
      responseCode: "UNAUTHENTICATED",
    };
  }
  try {
    const deviceToDelete = await db.device.findFirst({
      where: { id: device.id },
    });
    if (deviceToDelete?.userId == user.user.id) {
      await db.device.delete({ where: { id: device.id } });
      redirect("/devices");
    } else {
      return {
        responseCode: "UNAUTHORISED",
      };
    }
  } catch (e: unknown) {
    console.trace(e);
    return {
      responseCode: "DBERROR",
    };
  }
}
