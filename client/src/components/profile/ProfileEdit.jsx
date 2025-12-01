// client/src/components/profile/ProfileEdit.jsx (continued)
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import AvatarUpload from "./AvatarUpload";
import { userService } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";

const ProfileEdit = ({ user, onUpdate, onClose }) => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || "",
    bio: user.bio || "",
    college: user.college || "",
    year: user.year || "",
    branch: user.branch || "",
    socialLinks: {
      github: user.socialLinks?.github || "",
      linkedin: user.socialLinks?.linkedin || "",
      twitter: user.socialLinks?.twitter || "",
    },
  });

  const yearOptions = [
    "",
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Alumni",
    "Faculty",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userService.updateProfile(formData);
      updateUser(response.data);
      onUpdate(response.data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (avatar) => {
    updateUser({ avatar });
    onUpdate({ ...user, avatar });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <AvatarUpload
        currentAvatar={user.avatar}
        username={user.username}
        onUpdate={handleAvatarUpdate}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            maxLength={500}
            placeholder="Tell us about yourself..."
            className="input-field resize-none"
          />
        </div>

        <Input
          label="College/University"
          value={formData.college}
          onChange={(e) =>
            setFormData({ ...formData, college: e.target.value })
          }
          placeholder="e.g., MIT, Stanford"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className="input-field"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year || "Select year"}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Branch/Major"
            value={formData.branch}
            onChange={(e) =>
              setFormData({ ...formData, branch: e.target.value })
            }
            placeholder="e.g., Computer Science"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-dark-800 dark:text-dark-200">
            Social Links
          </h4>
          <Input
            label="GitHub"
            value={formData.socialLinks.github}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: {
                  ...formData.socialLinks,
                  github: e.target.value,
                },
              })
            }
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn"
            value={formData.socialLinks.linkedin}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: {
                  ...formData.socialLinks,
                  linkedin: e.target.value,
                },
              })
            }
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Twitter"
            value={formData.socialLinks.twitter}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: {
                  ...formData.socialLinks,
                  twitter: e.target.value,
                },
              })
            }
            placeholder="https://twitter.com/username"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" loading={loading} className="flex-1">
            Save Changes
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileEdit;
