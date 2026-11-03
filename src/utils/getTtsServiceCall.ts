import type { TtsConfig } from "@types";

export type TtsServiceCall = {
  domain: string;
  service: string;
  data: Record<string, unknown>;
};

/**
 * Builds the service call for the TTS panel.
 *
 * - With `satellite_entity_id`: `assist_satellite.announce` (Assist satellites, e.g. voice tablets).
 * - Otherwise: `tts.speak` with the TTS engine in `entity_id`, spoken on
 *   `media_player_entity_id` or, if unset, the card's own player.
 *
 * Returns undefined when there is nothing to send or no target is configured.
 */
export const getTtsServiceCall = (
  tts: TtsConfig | null | undefined,
  playerEntityId: string | undefined,
  message: string
): TtsServiceCall | undefined => {
  const text = message.trim();
  if (!tts || !text) return undefined;

  if (tts.satellite_entity_id) {
    return {
      domain: "assist_satellite",
      service: "announce",
      data: { entity_id: tts.satellite_entity_id, message: text },
    };
  }

  const target = tts.media_player_entity_id || playerEntityId;
  if (!tts.entity_id || !target) return undefined;

  return {
    domain: "tts",
    service: "speak",
    data: {
      entity_id: tts.entity_id,
      media_player_entity_id: target,
      message: text,
      ...(tts.language ? { language: tts.language } : {}),
      ...(tts.options ? { options: tts.options } : {}),
      ...(typeof tts.cache === "boolean" ? { cache: tts.cache } : {}),
    },
  };
};

export const isTtsConfigured = (tts: TtsConfig | null | undefined): boolean =>
  !!tts && (!!tts.satellite_entity_id || !!tts.entity_id);
