"use client";

import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

type Props = {
  imageUrls: string[];
};

export default function ListingGallery({ imageUrls }: Props) {
  const images = imageUrls.map((url) => ({
    original: url,
    thumbnail: url,
  }));

  return (
    <ImageGallery
      items={images}
      showPlayButton={false}
      showFullscreenButton={true}
      showNav={true}
      showThumbnails={true}
      additionalClass="rounded-lg overflow-hidden"
    />
  );
}
