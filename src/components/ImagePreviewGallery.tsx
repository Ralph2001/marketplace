"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  imageUrls: string[];
};

export default function ImagePreviewGallery({ imageUrls }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = imageUrls[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full md:w-[70%] h-full border rounded-2xl overflow-hidden flex flex-col bg-black">
      {/* Main Preview Image with Blurred Background */}
      <div className="relative flex-1 min-h-[400px] max-h-[50rem]">
        {selectedImage && (
          <>
            {/* Blurred Background */}
            <Image
              src={selectedImage}
              alt="Blurred background"
              fill
              quality={40}
              priority
              className="object-cover blur-2xl scale-110 opacity-30"
              sizes="100vw"
            />
            {/* Foreground Image */}
            <Image
              src={selectedImage}
              alt="Main Preview"
              fill
              quality={70}
              className="object-contain z-10"
              sizes="100vw"
            />
          </>
        )}
      </div>

      {/* Thumbnail Controls */}
      {imageUrls.length > 1 && (
        <div className="relative mt-2 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto px-1 hide-scrollbar">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative w-20 h-20 rounded overflow-hidden border-2 ${
                    index === selectedIndex
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover cursor-pointer"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
