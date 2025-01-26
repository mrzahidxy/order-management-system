import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

import { RatingStar } from "./Rating.component";

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const ProductCard = ({
  id,
  title,
  description,
  image,
}: ProductCardProps) => {
  return (
    <Link href={`/product/${id}`}>
      <Card key={id} className="w-full relative p-2 cursor-pointer group">
        <div className="h-[200px] relative transition-opacity duration-200 group-hover:opacity-80">
          <Image
            src={image || "/images/no-image.jpg"}
            fill
            className="object-contain"
            alt={title}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h4 className="truncate text-gray-8000 text-lg font-semibold mt-2">
          {title}
        </h4>
        <RatingStar rating={4} />
        <p className="text-sm font-medium truncate text-gray-500 mt-2">
          {description}
        </p>
      </Card>
    </Link>
  );
};
