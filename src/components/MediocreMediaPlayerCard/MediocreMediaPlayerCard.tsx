import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { useContext, useMemo } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import {
  getMediocreLegacyConfigToMediocreMultiConfig,
  getPlayerDisplayName,
} from "@utils";
import { useHass } from "@components/HassContext";
import { MediocreCompactMultiMediaPlayerCard } from "@components/MediocreCompactMultiMediaPlayerCard";
import { SelectedPlayerProvider } from "@components/SelectedPlayerContext";

export type MediocreMediaPlayerCardProps = {
  isEmbeddedInMultiCard?: boolean;
  onClick?: () => void;
};

export const MediocreMediaPlayerCard = ({
  isEmbeddedInMultiCard,
  onClick,
}: MediocreMediaPlayerCardProps) => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const hass = useHass();
  const displayName = getPlayerDisplayName(hass, config.entity_id, config.name);

  const multiConfig = useMemo(() => {
    return getMediocreLegacyConfigToMediocreMultiConfig({
      ...config,
      name: displayName ?? null,
    });
  }, [config, displayName]);

  return (
    <CardContextProvider rootElement={rootElement} config={multiConfig}>
      <SelectedPlayerProvider>
        <MediocreCompactMultiMediaPlayerCard
          isEmbeddedInMultiCard={isEmbeddedInMultiCard}
          onClick={onClick}
        />
      </SelectedPlayerProvider>
    </CardContextProvider>
  );
};
