import type { HomeAssistant, PlayerNameConfig, EntityNamePart } from "@types";

type FormatEntityName = (
  stateObj: unknown,
  name: EntityNamePart[],
  options?: { separator?: string }
) => string;

/**
 * Resolves the configured player name to a display string.
 *
 * - A string is used as-is.
 * - An array of name parts (`area`, `device`, `entity`, `floor`) is composed by
 *   Home Assistant's own `hass.formatEntityName` (2026.4+), so the card names
 *   players the same way the built-in cards do. Older Home Assistant versions
 *   fall back to the entity's friendly name.
 * - Anything else returns undefined, so callers keep their existing fallback.
 */
export const getPlayerDisplayName = (
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  name: PlayerNameConfig | undefined
): string | undefined => {
  if (typeof name === "string") {
    return name.length > 0 ? name : undefined;
  }
  if (!Array.isArray(name) || name.length === 0 || !hass || !entityId) {
    return undefined;
  }
  const stateObj = hass.states?.[entityId];
  if (!stateObj) {
    return undefined;
  }
  const haWithFormatter = hass as HomeAssistant & {
    formatEntityName?: FormatEntityName;
  };
  if (typeof haWithFormatter.formatEntityName === "function") {
    try {
      const formatted = haWithFormatter.formatEntityName(stateObj, name);
      if (formatted) {
        return formatted;
      }
    } catch {
      // fall through to friendly_name
    }
  }
  return (
    (stateObj.attributes?.friendly_name as string | undefined) ?? undefined
  );
};
