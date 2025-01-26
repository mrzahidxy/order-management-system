import { FiStar } from "react-icons/fi";

export const RatingStar = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: rating }).map((_, index) => (
        <FiStar key={index} fill="yellow" />
      ))}
    </div>
  );
};
