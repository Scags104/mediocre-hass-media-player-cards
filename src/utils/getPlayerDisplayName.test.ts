import { getPlayerDisplayName } from "@utils/getPlayerDisplayName";
import type { HomeAssistant } from "@types";

const stateObj = {
  entity_id: "media_player.living_room_chromecast",
  state: "idle",
  attributes: { friendly_name: "Chromecast" },
};

const makeHass = (formatEntityName?: unknown) =>
  ({
    states: { "media_player.living_room_chromecast": stateObj },
    ...(formatEntityName ? { formatEntityName } : {}),
  }) as unknown as HomeAssistant;

const parts = [{ type: "area" as const }, { type: "device" as const }];

describe("getPlayerDisplayName", () => {
  it("returns a plain string name as-is", () => {
    expect(
      getPlayerDisplayName(makeHass(), stateObj.entity_id, "Living Room TV")
    ).toBe("Living Room TV");
  });

  it("returns undefined for empty, null or missing names", () => {
    expect(getPlayerDisplayName(makeHass(), stateObj.entity_id, "")).toBe(
      undefined
    );
    expect(getPlayerDisplayName(makeHass(), stateObj.entity_id, null)).toBe(
      undefined
    );
    expect(
      getPlayerDisplayName(makeHass(), stateObj.entity_id, undefined)
    ).toBe(undefined);
    expect(getPlayerDisplayName(makeHass(), stateObj.entity_id, [])).toBe(
      undefined
    );
  });

  it("composes name parts with hass.formatEntityName", () => {
    const format = jest.fn(() => "Living Room Chromecast");
    expect(
      getPlayerDisplayName(makeHass(format), stateObj.entity_id, parts)
    ).toBe("Living Room Chromecast");
    expect(format).toHaveBeenCalledWith(stateObj, parts);
  });

  it("falls back to friendly_name when formatEntityName is unavailable", () => {
    expect(getPlayerDisplayName(makeHass(), stateObj.entity_id, parts)).toBe(
      "Chromecast"
    );
  });

  it("falls back to friendly_name when formatEntityName throws or is empty", () => {
    const throws = () => {
      throw new Error("boom");
    };
    expect(
      getPlayerDisplayName(makeHass(throws), stateObj.entity_id, parts)
    ).toBe("Chromecast");
    expect(
      getPlayerDisplayName(
        makeHass(() => ""),
        stateObj.entity_id,
        parts
      )
    ).toBe("Chromecast");
  });

  it("returns undefined when the entity does not exist", () => {
    expect(
      getPlayerDisplayName(makeHass(), "media_player.missing", parts)
    ).toBe(undefined);
  });
});
