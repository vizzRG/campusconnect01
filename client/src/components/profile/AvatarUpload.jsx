// client/src/components/profile/AvatarUpload.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CameraIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar.jsx";
import Button from "../common/Button.jsx";
import { userService } from "../../services/userService.js";

const AvatarUpload = ({ currentAvatar, username, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", fileInputRef.current.files[0]);

    try {
      const response = await userService.uploadAvatar(formData);
      onUpdate(response.data.avatar);
      setPreview(null);
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentAvatar) return;

    try {
      await userService.deleteAvatar();
      onUpdate("");
      toast.success("Avatar removed");
    } catch (error) {
      toast.error("Failed to remove avatar");
    }
  };

  const cancelPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar
          src={preview || currentAvatar}
          name={username}
          size="2xl"
          className="ring-4 ring-[#faf5ff]0/20"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <CameraIcon className="w-5 h-5" />
        </motion.button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="flex gap-2">
          <Button onClick={handleUpload} loading={uploading} size="sm">
            Save
          </Button>
          <Button variant="ghost" onClick={cancelPreview} size="sm">
            Cancel
          </Button>
        </div>
      ) : currentAvatar ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Remove Photo
        </Button>
      ) : (
        <p className="text-sm text-dark-500">Click camera icon to upload</p>
      )}
    </div>
  );
};

export default AvatarUpload;
