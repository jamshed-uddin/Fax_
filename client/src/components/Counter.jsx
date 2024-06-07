import { useEffect, useState } from "react";

const Counter = ({ minutes }) => {
  const [time, setTime] = useState({
    minutes,
    seconds: 60,
  });

  useEffect(() => {
    let interval;

    interval = setInterval(() => {
      if (time.minutes === 0 && time.seconds === 0) {
        clearInterval(interval);
      } else {
        setTime((prev) => {
          if (prev.seconds === 0) {
            return { minutes: prev.minutes - 1, seconds: 59 };
          } else {
            return { ...prev, seconds: prev.seconds - 1 };
          }
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return (
    <div className=" text-sm ">
      {time.minutes === 0 && time.seconds === 0 ? (
        <div className="text-red-500">Link expired</div>
      ) : (
        <div>
          <span>Link expires in</span>{" "}
          {time.minutes.toString().padStart(2, "0")}:
          {time.seconds.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
};

export default Counter;
