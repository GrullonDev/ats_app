/**
 * Formatted "time ago" string for display
 * @param dateString ISO format date string
 * @param t translation function from useTranslation
 * @returns localized string like "Just now", "2h", "Yesterday", "3d"
 */
export function getTimeAgo(dateString: string, t: any) {
  const now = new Date();
  const date = new Date(dateString);
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return t('common.justNow') || 'Just now';
  }
  
  if (diffInHours < 24) {
    return t('common.hoursAgoShort', { count: diffInHours }) || `${diffInHours}h`;
  }
  
  if (diffInHours < 48) {
    return t('common.yesterday') || 'Yesterday';
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return t('common.daysAgoShort', { count: diffInDays }) || `${diffInDays}d`;
}
