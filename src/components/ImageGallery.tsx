"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const backHome = (): void => {
    router.back();
  };

  return (
    <div className="relative w-full rounded-t-2xl flex flex-col md:h-[calc(100vh-6rem)]">
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0 bg-black/50 rounded-2xl overflow-hidden">
        <Image
          alt="Blurred Background"
          src={images[selectedImage]}
          fill
          className="object-cover blur-lg scale-110 opacity-50"
        />
      </div>

      <button
        onClick={() => backHome()}
        className="w-10 h-10 rounded-full hidden md:flex  cursor-pointer  top-2    bg-black/60 hover:bg-black/50 absolute z-50 left-2 shadow font-bold   text-white   items-center justify-center transition-colors"
      >
        <X size={20} />
      </button>

      {images?.length > 1 && (
        <>
          <button
            onClick={() => handleArrowClick("left")}
            className="w-12 rounded-full hidden md:flex top-0 bottom-0 my-auto cursor-pointer hover:bg-gray-300  h-12  bg-white absolute z-50 left-2 shadow font-bold   text-gray-800   items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleArrowClick("right")}
            className="w-12 rounded-full hidden md:flex top-0 bottom-0 my-auto cursor-pointer hover:bg-gray-300  h-12  bg-white absolute z-50 right-2 shadow font-bold   text-gray-800   items-center justify-center transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className=" z-10 w-full relative h-[40vh] md:h-[calc(100vh-6rem)] flex items-center justify-center">
        <Image
          alt="Main Image"
          src={images[selectedImage]}
          fill
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className=" z-10   p-2 w-full h-14 flex items-center justify-center px-1 rounded-b-2xl overflow-hidden">
          <div
            ref={thumbnailRef}
            className="flex overflow-x-auto scroll-smooth items-center justify-center  gap-2 px-2 w-full hide-scrollbar"
          >
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedImage(index);
                  scrollToThumbnail(index);
                }}
                className={`relative w-[40px] h-[45px] shrink-0 border-2 rounded-md overflow-hidden transition-all duration-200 cursor-pointer ${
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
        </div>
      )}
    </div>
  );
}
