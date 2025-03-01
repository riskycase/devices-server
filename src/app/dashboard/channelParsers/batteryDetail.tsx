import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdBattery20,
  MdBattery30,
  MdBattery50,
  MdBattery60,
  MdBattery80,
  MdBattery90,
  MdBatteryAlert,
  MdBatteryCharging20,
  MdBatteryCharging30,
  MdBatteryCharging50,
  MdBatteryCharging60,
  MdBatteryCharging80,
  MdBatteryCharging90,
  MdBatteryChargingFull,
  MdBatteryFull,
} from "react-icons/md";

enum BATTERY_HEALTH {
  "Cold" = 7,
  "Dead" = 4,
  "Good" = 2,
  "Overhead" = 3,
  "Over Voltage" = 5,
  "Unknown" = 1,
  "Unknown Failure" = 6,
}

enum BATTERY_POWER_SOURCE {
  "A/C" = 1,
  "USB" = 2,
  "Wireless" = 4,
  "Dock" = 8,
}

enum BATTERY_STATUS {
  "Charging" = 2,
  "Discharging" = 3,
  "Full" = 5,
  "Not Charging" = 4,
  "Unknown" = 1,
}

function getIcon(
  batteryLevel: number,
  status: BATTERY_STATUS,
  health: BATTERY_HEALTH
) {
  if (health != BATTERY_HEALTH.Good) {
    return MdBatteryAlert;
  } else {
    if (status == BATTERY_STATUS.Discharging) {
        if (batteryLevel === 100) return MdBatteryFull;
        if (batteryLevel >= 90) return MdBattery90;
        if (batteryLevel >= 80) return MdBattery80;
        if (batteryLevel >= 60) return MdBattery60;
        if (batteryLevel >= 50) return MdBattery50;
        if (batteryLevel >= 30) return MdBattery30;
        return MdBattery20;
    } else {
      if (batteryLevel === 100) return MdBatteryChargingFull;
      if (batteryLevel >= 90) return MdBatteryCharging90;
      if (batteryLevel >= 80) return MdBatteryCharging80;
      if (batteryLevel >= 60) return MdBatteryCharging60;
      if (batteryLevel >= 50) return MdBatteryCharging50;
      if (batteryLevel >= 30) return MdBatteryCharging30;
      return MdBatteryCharging20;
    }
  }
}

export default function BatteryDetails({
  detailsString,
}: {
  detailsString: string | undefined;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (detailsString) {
    const deviceBatteryDetails = JSON.parse(detailsString);
    const iconElement = getIcon(
      deviceBatteryDetails.level,
      deviceBatteryDetails.status,
      deviceBatteryDetails.health
    );
    const icon = { iconElement };
    deviceBatteryDetails.health = BATTERY_HEALTH[deviceBatteryDetails.health];
    deviceBatteryDetails.powerSource =
      BATTERY_POWER_SOURCE[deviceBatteryDetails.powerSource];
    deviceBatteryDetails.status = BATTERY_STATUS[deviceBatteryDetails.status];
    return (
      <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
        <PopoverTrigger>
          <Flex
            direction="row"
            alignItems="center"
            gap={2}
            onMouseLeave={onClose}
            onMouseEnter={onOpen}
          >
            <Text>{deviceBatteryDetails.level}%</Text>
            {icon.iconElement && <icon.iconElement />}
          </Flex>
        </PopoverTrigger>
        <PopoverContent color={theme.colors.gray[700]} padding={2}>
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="start"
            onMouseLeave={onClose}
            onMouseEnter={onOpen}
          >
            <Flex direction="column" alignItems="start" gap={1}>
              <Text>Status: {deviceBatteryDetails.status}</Text>
              <Text>Health: {deviceBatteryDetails.health}</Text>
              {deviceBatteryDetails.powerSource && (
                <Text>Power Source: {deviceBatteryDetails.powerSource}</Text>
              )}
            </Flex>
            <Flex direction="column" alignItems="end" gap={1}>
              <Text>
                {Number(deviceBatteryDetails.temperature / 10).toFixed(1)}°C
              </Text>
              <Text>
                {Number(deviceBatteryDetails.voltage / 1000).toFixed(1)}V
              </Text>
              <Text>
                {Number(deviceBatteryDetails.current / 1000).toFixed(1)}mA
              </Text>
            </Flex>
          </Flex>
        </PopoverContent>
      </Popover>
    );
  } else return <></>;
}
