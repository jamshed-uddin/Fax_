import { useNavigate } from "react-router-dom";
import useChatProvider from "../hooks/useChatProvider";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const NavigateBack = () => {
  const { setIsSideChatOpen } = useChatProvider();
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer "
      onClick={() => {
        navigate(-1);
        setIsSideChatOpen(true);
      }}
    >
      <ArrowLeftIcon className="w-6 h-6 " />
    </div>
  );
};

export default NavigateBack;
