import React, { useCallback, useEffect, useState } from "react";

const useLongPress = (callback, threshold = 400) => {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timeId;

    if (startLongPress) {
      timeId = setTimeout(callback, threshold);
    } else {
      clearTimeout(timeId);
    }

    return () => {
      clearTimeout(timeId);
    };
  }, [callback, startLongPress, threshold]);

  const start = useCallback(() => {
    setStartLongPress(true);
  }, []);
  const stop = useCallback(() => {
    setStartLongPress(false);
  }, []);

  // return {
  //   onMouseDown: start,
  //   onMouseUp: stop,
  //   onMouseOut: stop,
  //   onTouchStart: start,
  //   onTouchEnd: stop,
  //   onTouchCancel: stop,
  // };

  return { start: start, stop: stop };
};

export default useLongPress;
