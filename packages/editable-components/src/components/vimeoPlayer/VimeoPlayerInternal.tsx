/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import Player from "@vimeo/player";
import { CompiledShopstoryComponentProps } from "../../types";
import React from "react";

declare const Vimeo: { Player: typeof Player };

type VimeoPlayerProps = CompiledShopstoryComponentProps;

const VIMEO_URL = "https://vimeo.com/";

export function VimeoPlayerInternal({ __fromEditor }: VimeoPlayerProps) {
  const { Fragment, useEffect, useState, useRef } = React;
  const [canPlayerBeLoaded, setCanPlayerBeLoaded] = useState(false);
  const playerLoadingStatusRef = useRef<"not_loaded" | "loaded" | "error">(
    "not_loaded"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const embeddedPlayerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerInstanceRef = useRef<Player | null>(null);

  const { areControlsDisabled, isAutoPlay, isLoop, isMuted, videoId } =
    __fromEditor.props;

  const {
    AspectRatioMaker,
    ErrorContainer,
    ContentWrapper,
    Placeholder,
    PlayerContainer,
    Wrapper,
  } = __fromEditor.components;

  async function initVimeoPlayer() {
    await loadVimeoPlayer();

    const url = `${VIMEO_URL}${videoId}`;

    playerInstanceRef.current = new Vimeo.Player(
      embeddedPlayerContainerRef.current!,
      {
        url,
        responsive: true,
        autoplay: isAutoPlay,
        loop: isLoop,
        controls: !areControlsDisabled,
        muted: isMuted,
        portrait: false,
        title: false,
        byline: false,
      }
    );

    playerInstanceRef.current
      .ready()
      .then(() => {
        playerLoadingStatusRef.current = "loaded";
        setErrorMessage(null);
      })
      .catch(() => {
        playerLoadingStatusRef.current = "error";
        setErrorMessage(
          "Error during loading the video. Make sure given ID is correct and the video is available."
        );
      });

    playerInstanceRef.current.on("error", (error) => {
      // Swallow error message in global error handler to prevent unhandled rejections
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    });
  }

  useEffect(
    function enablePlayerLoadingWhenIdleOrInViewport() {
      if (canPlayerBeLoaded) {
        return;
      }

      let idleCallbackRequestId: number | undefined;
      let intersectionObserver: IntersectionObserver | undefined;
      const isRequestIdleCallbackSupported = "requestIdleCallback" in window;

      function idleCallback() {
        if (canPlayerBeLoaded) {
          return;
        }

        setCanPlayerBeLoaded(true);
        intersectionObserver?.disconnect();
      }

      function cancelIdleCallback() {
        if (idleCallbackRequestId) {
          if (isRequestIdleCallbackSupported) {
            window.cancelIdleCallback(idleCallbackRequestId);
          } else {
            clearTimeout(idleCallbackRequestId);
          }
        }
      }

      if (
        videoId &&
        !playerInstanceRef.current &&
        embeddedPlayerContainerRef.current
      ) {
        idleCallbackRequestId = isRequestIdleCallbackSupported
          ? window.requestIdleCallback(idleCallback, { timeout: 2000 })
          : window.setTimeout(idleCallback, 0);

        intersectionObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setCanPlayerBeLoaded(true);
              cancelIdleCallback();
            }
          },
          { threshold: 0.5 }
        );

        intersectionObserver.observe(embeddedPlayerContainerRef.current);
      }

      return () => {
        cancelIdleCallback();
        intersectionObserver?.disconnect();
      };
    },
    [videoId, canPlayerBeLoaded]
  );

  useEffect(() => {
    if (playerLoadingStatusRef.current === "loaded") {
      initVimeoPlayer();
    }
  }, [areControlsDisabled, isAutoPlay]);

  useEffect(() => {
    const playerLoadingStatus = playerLoadingStatusRef.current;

    async function loadVideoById(videoId: string) {
      try {
        await playerInstanceRef.current?.loadVideo(Number(videoId));
        playerLoadingStatusRef.current = "loaded";

        if (errorMessage !== null) {
          setErrorMessage(null);
        }
      } catch (reason) {
        playerLoadingStatusRef.current = "error";
        setErrorMessage(
          "Error during loading the video. Make sure given ID is correct and the video is available."
        );
      }
    }

    if (canPlayerBeLoaded) {
      if (playerLoadingStatus === "loaded") {
        if (videoId === "") {
          playerInstanceRef.current?.destroy();
          playerLoadingStatusRef.current = "not_loaded";
        } else {
          loadVideoById(videoId);
        }
      } else if (
        playerLoadingStatus === "error" ||
        playerLoadingStatus === "not_loaded"
      ) {
        if (videoId === "" && playerLoadingStatus === "error") {
          playerInstanceRef.current?.destroy();
        } else if (videoId !== "") {
          playerInstanceRef.current?.destroy();
          initVimeoPlayer();
        }

        setErrorMessage(null);
      }
    }
  }, [videoId, canPlayerBeLoaded]);

  useEffect(() => {
    playerInstanceRef.current?.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    playerInstanceRef.current?.setLoop(isLoop);
  }, [isLoop]);

  return (
    <Wrapper>
      <AspectRatioMaker />

      <ContentWrapper>
        {videoId ? (
          <Fragment>
            <PlayerContainer ref={embeddedPlayerContainerRef} />
            {errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}
          </Fragment>
        ) : (
          <Placeholder />
        )}
      </ContentWrapper>
    </Wrapper>
  );
}

async function loadVimeoPlayer() {
  const vimeoScriptElement = document.createElement("script");

  return new Promise((resolve, reject) => {
    vimeoScriptElement.onload = resolve;
    vimeoScriptElement.onerror = reject;
    vimeoScriptElement.async = true;
    vimeoScriptElement.src = "https://player.vimeo.com/api/player.js";
    document.body.appendChild(vimeoScriptElement);
  });
}
