"use client"; // Adicionado se houver interatividade, mas para exibição pode não ser necessário

import Image from "next/image";
import type { UserDashboardProfile } from "@/types/dashboard"; // Importar tipo centralizado

// Removida a definição local de UserData
// interface UserData { ... }

interface ProfileCardProps {
  userData: UserDashboardProfile | null; // Permitir que userData seja null
}

export default function ProfileCard({ userData }: ProfileCardProps) {
  // Se não houver dados do usuário (carregando ou erro), pode-se mostrar um loader ou nada
  if (!userData) {
    // Pode retornar um skeleton loader específico para o card
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-300"></div>
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="border-t pt-4 mt-2 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1">
      <div className="flex items-center mb-4">
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-red-600">
            <Image
              src={userData.avatarUrl || "/diverse-profile-avatars.png"} 
              alt={userData.name || "Profile"}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-4">
          <h2 className="font-bold text-base md:text-lg">{userData.name}</h2>
          <p className="text-gray-600 text-xs md:text-sm">@{userData.username}</p>
        </div>
      </div>

      <div className="border-t pt-4 mt-2">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-sm">Posts</span>
          <span className="font-medium text-sm">{userData.posts}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-sm">Followers</span>
          <span className="font-medium text-sm">{userData.followers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 text-sm">Following</span>
          <span className="font-medium text-sm">{userData.following}</span>
        </div>
      </div>
    </div>
  );
} 