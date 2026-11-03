import { getTtsServiceCall, isTtsConfigured } from "@utils/getTtsServiceCall";

const player = "media_player.office_speaker";

describe("getTtsServiceCall", () => {
  it("uses tts.speak on the card's player by default", () => {
    expect(
      getTtsServiceCall(
        { entity_id: "tts.piper" },
        player,
        "  Dinner is ready "
      )
    ).toEqual({
      domain: "tts",
      service: "speak",
      data: {
        entity_id: "tts.piper",
        media_player_entity_id: player,
        message: "Dinner is ready",
      },
    });
  });

  it("speaks on media_player_entity_id when set", () => {
    expect(
      getTtsServiceCall(
        {
          entity_id: "tts.piper",
          media_player_entity_id: "media_player.office_speaker_cast",
        },
        player,
        "Hi"
      )?.data.media_player_entity_id
    ).toBe("media_player.office_speaker_cast");
  });

  it("passes language, options and cache", () => {
    expect(
      getTtsServiceCall(
        {
          entity_id: "tts.cloud",
          language: "en-GB",
          options: { voice: "RyanNeural" },
          cache: false,
        },
        player,
        "Hi"
      )?.data
    ).toEqual({
      entity_id: "tts.cloud",
      media_player_entity_id: player,
      message: "Hi",
      language: "en-GB",
      options: { voice: "RyanNeural" },
      cache: false,
    });
  });

  it("announces through an Assist satellite when satellite_entity_id is set", () => {
    expect(
      getTtsServiceCall(
        {
          entity_id: "tts.piper",
          satellite_entity_id: "assist_satellite.kitchen_tablet",
        },
        player,
        "Hi"
      )
    ).toEqual({
      domain: "assist_satellite",
      service: "announce",
      data: { entity_id: "assist_satellite.kitchen_tablet", message: "Hi" },
    });
  });

  it("returns undefined for empty text or missing configuration", () => {
    expect(getTtsServiceCall({ entity_id: "tts.piper" }, player, "   ")).toBe(
      undefined
    );
    expect(getTtsServiceCall(undefined, player, "Hi")).toBe(undefined);
    expect(getTtsServiceCall({}, player, "Hi")).toBe(undefined);
    expect(getTtsServiceCall({ entity_id: "tts.piper" }, undefined, "Hi")).toBe(
      undefined
    );
  });
});

describe("isTtsConfigured", () => {
  it("needs a TTS engine or a satellite", () => {
    expect(isTtsConfigured(undefined)).toBe(false);
    expect(isTtsConfigured({})).toBe(false);
    expect(isTtsConfigured({ entity_id: "tts.piper" })).toBe(true);
    expect(isTtsConfigured({ satellite_entity_id: "assist_satellite.x" })).toBe(
      true
    );
  });
});
