function addEventListener<EventName extends keyof WindowEventMap>(
  target: EventTarget,
  type: EventName,
  listener: (event: WindowEventMap[EventName]) => void,
  options?: boolean | AddEventListenerOptions
) {
  target.addEventListener(type, listener as EventListener, options);

  return () => {
    target.removeEventListener(type, listener as EventListener, options);
  };
}

export { addEventListener };
