// client/src/utils/formatDate.js
import { formatDistanceToNow, format } from "date-fns";

export const formatRelativeDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFullDate = (date) => {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
};
