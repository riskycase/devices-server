import { CircularProgress, Flex, Switch, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdScreenLockLandscape } from "react-icons/md";

enum WakelockSentinelStates {
  INACTIVE,
  REQUESTED,
  ACTIVE,
}

export default function ScreenWakeLock() {
  if (!navigator.wakeLock) {
    return <></>;
  }
  const [wakelockSentinel, setWakelockSentinel] = useState<
    WakeLockSentinel | undefined
  >();
  const [wakelockState, setWakelockState] = useState<WakelockSentinelStates>(
    WakelockSentinelStates.INACTIVE,
  );
  useEffect(() => {
    if (
      wakelockSentinel !== undefined &&
      document.visibilityState === "visible"
    ) {
      setWakelockState(WakelockSentinelStates.REQUESTED);
      navigator.wakeLock
        .request("screen")
        .then((sentinel) => {
          setWakelockSentinel(sentinel);
          setWakelockState(WakelockSentinelStates.ACTIVE);
        })
        .then(() => document.body.requestFullscreen())
        .catch(() => {
          setWakelockState(WakelockSentinelStates.INACTIVE);
          document.exitFullscreen();
        });
    }
  }, [document.visibilityState]);
  return (
    <Tooltip label="Keep screen awake" placement="bottom-end">
      <Flex direction="row" alignItems="center" gap={2}>
        <Switch
          isChecked={wakelockState === WakelockSentinelStates.ACTIVE}
          isDisabled={wakelockState === WakelockSentinelStates.REQUESTED}
          onChange={(e) => {
            if (e.target.checked) {
              setWakelockState(WakelockSentinelStates.REQUESTED);
              navigator.wakeLock
                .request("screen")
                .then((sentinel) => {
                  setWakelockSentinel(sentinel);
                  setWakelockState(WakelockSentinelStates.ACTIVE);
                })
                .then(() => document.body.requestFullscreen())
                .catch(() => {
                  setWakelockState(WakelockSentinelStates.INACTIVE);
                  document.exitFullscreen();
                });
            } else {
              wakelockSentinel?.release().then(() => {
                setWakelockSentinel(undefined);
                setWakelockState(WakelockSentinelStates.INACTIVE);
                document.exitFullscreen();
              });
            }
          }}
        />
        {wakelockState === WakelockSentinelStates.REQUESTED ? (
          <CircularProgress isIndeterminate size="24px" />
        ) : (
          <MdScreenLockLandscape size={24} />
        )}
      </Flex>
    </Tooltip>
  );
}
