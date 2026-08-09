import { User, Heart } from 'lucide-react'

interface UserAvatarProps {
  gender?: string
  name?: string
  className?: string
}

export default function UserAvatar({ gender, name, className = "w-10 h-10" }: UserAvatarProps) {
  const cleanGender = gender?.toLowerCase().trim() || ''
  const isFemale = cleanGender === 'female' || cleanGender === 'f' || cleanGender === 'mahila' || cleanGender === 'woman' || cleanGender === 'girl'

  // Extract first letter of name if available for fallback initial
  const initial = name ? name.trim().charAt(0).toUpperCase() : ''

  return (
    <div 
      className={`rounded-2xl flex items-center justify-center font-black text-sm tracking-wider shadow-md transition-all shrink-0 ${
        isFemale 
          ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-pink-500/25' 
          : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-indigo-500/25'
      } ${className}`}
    >
      {isFemale ? (
        <Heart size={18} className="fill-white/25 stroke-[2.5]" />
      ) : initial ? (
        <span>{initial}</span>
      ) : (
        <User size={18} className="stroke-[2.5]" />
      )}
    </div>
  )
}