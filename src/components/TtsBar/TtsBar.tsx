import { useState } from "preact/hooks";
import { css } from "@emotion/react";
import { Input } from "@components/Input";
import { IconButton } from "@components/IconButton";
import { getHass } from "@utils/getHass";
import { getTtsServiceCall } from "@utils/getTtsServiceCall";
import type { TtsConfig } from "@types";

const styles = {
  root: css({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px 12px 12px",
  }),
  input: css({
    flex: 1,
  }),
  error: css({
    color: "var(--error-color)",
    fontSize: "12px",
    padding: "0 12px 12px 12px",
    marginTop: "-6px",
  }),
};

export type TtsBarProps = {
  tts: TtsConfig;
  entityId: string | undefined;
};

export const TtsBar = ({ tts, entityId }: TtsBarProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const call = getTtsServiceCall(tts, entityId, message);

  const send = async (e?: Event) => {
    e?.preventDefault();
    if (!call || sending) return;
    setSending(true);
    setError(undefined);
    try {
      await getHass().callService(call.domain, call.service, call.data);
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ((err as { message?: string })?.message ?? "Could not send")
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="mmpc-tts">
      <form css={styles.root} onSubmit={send}>
        <Input
          css={styles.input}
          value={message}
          onChange={setMessage}
          placeholder={tts.placeholder ?? "Text to speak..."}
          disabled={sending}
          loading={sending}
          name="mmpc-tts-message"
        />
        <IconButton
          id="mmpc-tts-send"
          size="x-small"
          icon="mdi:send"
          title="Send"
          aria-label="Send"
          disabled={!call || sending}
          onClick={() => send()}
        />
      </form>
      {error && <div css={styles.error}>{error}</div>}
    </div>
  );
};
