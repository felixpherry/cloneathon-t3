import React from 'react';

export default function useIntersectionObserver(
  targetRef: React.RefObject<null | HTMLElement>,
  callback: () => void
) {
  // I wanna avoid stale closure but I also don't wanna pass the callback directly as dependency array. Don't want the effect to run
  // unnecessarily just because of reference changes.
  // Expecting the consumer to wrap the callback with useCallback is an unreasonable expectation imo.
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      });
    });
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
    return () => observer.disconnect();
  }, [targetRef]);
}
