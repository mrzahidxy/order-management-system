import Image from "next/image";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  src: string;
};

export const CustomImage = ({
  width,
  height,
  className,
  src = "/images/hiking.jpg",
}: Props) => {
  return (
    <div
      className={`relative w-24 h-24 ${className}`}
      style={{ width: width, height: height }}
    >
      <Image
        src={src}
        alt=""
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
};
