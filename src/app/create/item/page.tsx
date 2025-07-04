"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import {
  X,
  UploadCloud,
  DollarSign,
  Tag,
  ChartBarStacked,
  MapPin,
  AtSign,
  MapPinCheck,
  User,
  Map,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../../libs/supabase";
import Image from "next/image";
import { compressImage } from "../../../../utils/compressImage";
import { CATEGORIES } from "../../../../constants/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateItemFormPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_IMAGES = 10;
  const MAX_IMAGE_SIZE_MB = 5;

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setEmailAddress(data.user.email || "");
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const totalImages = images.length + imageFiles.length;
    if (totalImages > MAX_IMAGES) {
      // alert(`You can only upload up to ${MAX_IMAGES} images.`);
      toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    try {
      const compressedResults = await Promise.all(
        imageFiles.map(async (file) => {
          if (file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            const compressed = await compressImage(file);
            return {
              file: compressed,
              previewUrl: URL.createObjectURL(compressed),
            };
          } else {
            // alert(
            //   `"${file.name}" is too large. Max file size is ${MAX_IMAGE_SIZE_MB}MB.`
            // );
            toast.error(
              `"${file.name}" is too large. Max file size is ${MAX_IMAGE_SIZE_MB}MB.`
            );
            return null;
          }
        })
      );

      const validResults = compressedResults.filter(Boolean) as {
        file: File;
        previewUrl: string;
      }[];

      const newFiles = validResults.map((r) => r.file);
      const newPreviews = validResults.map((r) => r.previewUrl);

      setImages((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      if (!selectedImage && newPreviews.length > 0) {
        setSelectedImage(newPreviews[0]);
      }
    } catch (err) {
      console.error("Image compression error:", err);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedUrls = [...previewUrls];
    const updatedFiles = [...images];

    updatedUrls.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviewUrls(updatedUrls);
    setImages(updatedFiles);

    // Update selected image if it was removed
    if (selectedImage === previewUrls[index]) {
      setSelectedImage(updatedUrls[0] || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !price || !category || !location || !emailAddress) {
      // setErrorMsg("All required fields must be filled.");
      toast.error("All required fields must be filled.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      // setErrorMsg("You must be logged in to create a listing.");
      toast.error("You must be logged in to create a listing.");
      setLoading(false);
      return;
    }

    // 1. Insert the listing first (without images)
    const { data: listingData, error: insertError } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        title,
        price: Number(price),
        description,
        category,
        location,
        email_address: emailAddress,
      })
      .select()
      .single();

    if (insertError || !listingData) {
      // setErrorMsg("Something went wrong while saving the listing.");
      toast.error("Something went wrong while saving the listing.");
      console.error(insertError);
      setLoading(false);
      return;
    }

    const listingId = listingData.id;

    // 2. Upload each image to Supabase Storage
    const uploadedImageUrls: string[] = [];

    for (const file of images) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `listings/${listingId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        // console.error("Upload failed:", uploadError);
        toast.error("Image upload failed.");
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    // 3. Update the listing with image URLs
    await supabase
      .from("listings")
      .update({
        image_urls: uploadedImageUrls,
      })
      .eq("id", listingId);

    toast.success("Listing published successfully!");

    setTimeout(() => {
      router.push("/");
    }, 500);

    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("");
    setLocation("");
    setEmailAddress("");
    setImages([]);
    setPreviewUrls([]);
    setSelectedImage(null);
    setLoading(false);
  };

  return (
    <div className="flex max-w-screen-xl mx-auto h-full py-4">
      {/* Sidebar Form */}
      <aside className=" hidden  md:block fixed  top-0 bottom-0 left-0 w-80 bg-white  shadow-lg p-5 z-50">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/create"
            className="rounded-full bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
          >
            <X size={20} className="text-gray-600" />
          </Link>
          <span className="text-lg font-semibold text-gray-800">
            Item for sale
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full pb-14">
          <div className="flex flex-col gap-4 overflow-y-auto py-2 hide-scrollbar p-1">
            <div className="w-full flex flex-col">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                <UploadCloud size={14} />
                Upload Photos
              </label>

              {/* Upload Button / Drop Area */}
              <label
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                className={`cursor-pointer border text-wrap h-20 border-dashed ${
                  isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
                } rounded p-4 text-center text-sm text-gray-500 hover:bg-gray-100`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  const imageFiles = files.filter((file) =>
                    file.type.startsWith("image/")
                  );

                  const totalImages = images.length + imageFiles.length;
                  if (totalImages > MAX_IMAGES) {
                    alert(`You can only upload up to ${MAX_IMAGES} images.`);
                    return;
                  }

                  const validImages: File[] = [];
                  const newPreviews: string[] = [];

                  imageFiles.forEach((file) => {
                    if (file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                      validImages.push(file);
                      newPreviews.push(URL.createObjectURL(file));
                    } else {
                      alert(
                        `"${file.name}" is too large. Max file size is ${MAX_IMAGE_SIZE_MB}MB.`
                      );
                    }
                  });

                  setImages((prev) => [...prev, ...validImages]);
                  setPreviewUrls((prev) => [...prev, ...newPreviews]);
                  if (!selectedImage && newPreviews.length > 0) {
                    setSelectedImage(newPreviews[0]);
                  }
                }}
              >
                Drag and drop or click to upload images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 mt-1">
                  (Max 10 images, 5MB each)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {previewUrls.length}/{MAX_IMAGES}
                </p>
              </div>

              {/* Thumbnail Grid */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3 transition-colors duration-300">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-full h-24 rounded overflow-hidden"
                    >
                      <Image
                        quality={10}
                        priority={false}
                        src={url}
                        alt={`Uploaded ${index + 1}`}
                        className="object-cover"
                        width={100}
                        height={100}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 hover:bg-red-400 hover:text-white cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1 z-10"
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}

            <div className="w-full flex flex-col">
              <p className="font-bold text-sm">Required</p>
              <p className="text-sm text-gray-600">
                Be as descriptive as possible.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Tag size={14} />
                Title
              </label>

              <Input
                type="text"
                placeholder="What are you selling?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <DollarSign size={14} />
                Price
              </label>

              <Input
                type="number"
                placeholder="₱ Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <ChartBarStacked size={14} />
                Category
              </label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Description
              </label>

              <Textarea
                placeholder="Add some details about your item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="w-full flex flex-col">
              <p className="font-bold text-sm">More Details</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <MapPin size={14} />
                Location
              </label>

              <Input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <AtSign size={14} />
                Contact Email
              </label>

              <Input
                type="text"
                placeholder="Enter your email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="h-fit flex w-full items-center justify-center ">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </aside>

      {/* Main Preview */}
      <main className="flex-1 md:ml-80  bg-gray-50 h-full">
        <div className=" mx-auto flex flex-col h-full bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-bold">Preview</h2>
          <div className="flex flex-col md:flex-row gap-4 h-full">
            <div className=" w-full md:w-[600px] max-h-[40rem] h-full border rounded-2xl overflow-hidden flex flex-col">
              {/* Main Preview Image */}
              <div className="relative flex-1 rounded overflow-hidden cursor-pointer bg-gray-100">
                {/* Blurred Background */}
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Blurred background"
                    fill
                    quality={50}
                    priority={true}
                    className="object-cover blur-2xl scale-110 opacity-40"
                    sizes="100vw"
                  />
                )}

                {/* Contained Foreground Image */}
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Main Preview"
                    fill
                    quality={10}
                    priority={false}
                    className="object-contain z-10"
                    sizes="100vw"
                  />
                )}
              </div>

              {/* Thumbnails Gallery */}
              {previewUrls.length > 1 && (
                <div className="mt-2 overflow-x-auto max-w-full hide-scrollbar">
                  <div className="flex gap-2 p-1 w-max snap-x snap-mandatory">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`relative min-w-[5rem] h-20 snap-start rounded overflow-hidden border-2 ${
                          selectedImage === url
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        onClick={() => setSelectedImage(url)}
                      >
                        <Image
                          quality={10}
                          priority={false}
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover cursor-pointer"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-80 border flex flex-col rounded-md p-4 h-full bg-white shadow-sm">
              <div className="space-y-4 w-full h-full text-sm text-gray-700">
                {/* Title and Price */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {title || "Untitled Item"}
                  </h3>
                  <p className="text-blue-600 font-bold text-base">
                    {price
                      ? `₱${new Intl.NumberFormat("en-PH", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(price))}`
                      : "₱0.00"}
                  </p>

                  <div className="text-xs text-gray-500">
                    <p>Listed</p>
                    <p>Few minutes ago</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">Details</p>
                  <p className="break-words">
                    {description || "Description will appear here..."}
                  </p>
                </div>

                {/* Location Map Icon */}
                <div className="w-full flex items-center justify-center h-24 rounded-lg bg-blue-100 hover:bg-blue-200 transition">
                  <Map size={36} className="text-blue-500" />
                </div>

                {/* Location Text */}
                <div className="space-y-0.5">
                  <p className="font-medium text-gray-800 break-words">
                    {location || "Location not provided"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Location is approximate
                  </p>
                </div>

                <hr className="border-gray-300 my-4" />

                {/* Seller Info */}
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-gray-800">
                    Seller Information
                  </p>
                  <div className="flex items-center gap-2 break-all text-gray-600">
                    <User size={16} className="text-gray-500" />
                    <p>{emailAddress || "seller@example.com"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
