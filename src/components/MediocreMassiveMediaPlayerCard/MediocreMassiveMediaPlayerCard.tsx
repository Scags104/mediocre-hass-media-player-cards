import { useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import {
  MediocreLargeMultiMediaPlayerCard,
  SelectedPlayerProvider,
} from "@components";
import { getMediocreMassiveLegacyConfigToMediocreMultiConfig } from "@utils/getMediocreMassiveLegacyConfigToMultiConfig";
import { getPlayerDisplayName } from "@utils/getPlayerDisplayName";
import { useHass } from "@components/HassContext";

export const MediocreMassiveMediaPlayerCard = ({
  className,
}: {
  className?: string;
}) => {
  const { config, rootElement } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const hass = useHass();
  const displayName = getPlayerDisplayName(hass, config.entity_id, config.name);

  const multiConfig = useMemo(() => {
    return getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...config,
      name: displayName ?? null,
    });
  }, [config, displayName]);

  return (
    <CardContextProvider rootElement={rootElement} config={multiConfig}>
      <SelectedPlayerProvider>
        <MediocreLargeMultiMediaPlayerCard className={className} />
      </SelectedPlayerProvider>
    </CardContextProvider>
  );
};
