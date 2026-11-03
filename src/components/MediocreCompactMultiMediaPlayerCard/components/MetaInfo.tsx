import { Fragment } from "preact/jsx-runtime";
import { usePlayer } from "@components/PlayerContext";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  titleText: css({
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.colors.onCard,
  }),
  artistText: css({
    margin: 0,
    fontSize: "14px",
    color: theme.colors.onCardMuted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

export type MetaInfoProps = {
  /** Replaces the media title (e.g. the player name when nothing is loaded) */
  titleOverride?: string;
  /** Replaces the subtitle; only used together with titleOverride */
  subtitleOverride?: string;
};

export const MetaInfo = ({
  titleOverride,
  subtitleOverride,
}: MetaInfoProps) => {
  const player = usePlayer();
  const title = titleOverride ?? player.title;
  const subtitle = titleOverride ? subtitleOverride : player.subtitle;

  return (
    <Fragment>
      {!!title && <h3 css={styles.titleText}>{title}</h3>}
      {!!subtitle && <p css={styles.artistText}>{subtitle}</p>}
    </Fragment>
  );
};
