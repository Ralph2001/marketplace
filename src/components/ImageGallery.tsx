"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type ImageGalleryProps = {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
};

export default function ImageGallery({
  images,
  selectedImage,
  setSelectedImage,
}: ImageGalleryProps) {
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const scrollToThumbnail = (index: number) => {
    const container = thumbnailRef.current;
    const thumbnail = container?.children[index] as HTMLElement | undefined;
    if (thumbnail && container) {
      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumbnail.getBoundingClientRect();

      if (
        thumbRect.left < containerRect.left ||
        thumbRect.right > containerRect.right
      ) {
        container.scrollBy({
          left:
            thumbRect.left -
            containerRect.left -
            container.clientWidth / 2 +
            thumbRect.width / 2,
          behavior: "smooth",
        });
      }
    }
  };

  const handleArrowClick = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? (selectedImage - 1 + images.length) % images.length
        : (selectedImage + 1) % images.length;

    setSelectedImage(newIndex);
    scrollToThumbnail(newIndex);
  };

  return (
    <div className="relative w-full rounded-t-2xl flex flex-col md:h-[calc(100vh-6rem)]">
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
        <Image
          alt="Blurred Background"
          src={images[selectedImage]}
          fill
          className="object-cover blur-lg scale-110 opacity-50"
        />
      </div>

      {/* Main Image */}
      <div className="relative z-10 w-full h-[40vh] md:h-[calc(100vh-6rem)] flex items-center justify-center">
        <Image
          alt="Main Image"
          src={images[selectedImage]}
          fill
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="relative z-10 h-[110px] md:h-[120px] w-full bg-black/70 backdrop-blur flex items-center px-1 rounded-b-2xl overflow-hidden">
        <button
          onClick={() => handleArrowClick("left")}
          className="w-8 md:w-10 h-[80%] bg-white/20 hover:bg-white/40 rounded-md text-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={thumbnailRef}
          className="flex overflow-x-auto scroll-smooth  gap-2 px-2 w-full hide-scrollbar"
        >
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedImage(index);
                scrollToThumbnail(index);
              }}
              className={`relative w-[80px] h-[90px] shrink-0 border-2 rounded-md overflow-hidden transition-all duration-200 cursor-pointer ${
                selectedImage === index
                  ? "border-blue-500 shadow-md opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleArrowClick("right")}
          className="w-8 md:w-10 h-[80%] bg-white/20 hover:bg-white/40 rounded-md text-white flex items-center justify-center transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
