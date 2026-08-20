import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AvatarImageProps {
  fullName: string
  avatarUrl?: string | null
  className?: string
}

export function AvatarImage({ fullName, avatarUrl, className }: AvatarImageProps) {
  const [imgError, setImgError] = React.useState(false)

  React.useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const renderInitials = () => {
    const initials = getInitials(fullName);
    return (
      <div 
        className="w-full h-full flex items-center justify-center text-white font-extrabold text-sm uppercase tracking-wider rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#150B2D]"
      >
        {initials}
      </div>
    );
  };

  return (
    <div className={cn("relative overflow-hidden shrink-0 rounded-full shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 p-0.5", className)}>
      {avatarUrl && !imgError ? (
        <div className="absolute inset-0.5 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt={fullName}
            fill
            sizes="96px"
            className="object-cover rounded-full"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        renderInitials()
      )}
    </div>
  )
}
