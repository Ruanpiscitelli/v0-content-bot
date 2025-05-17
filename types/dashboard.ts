// types/dashboard.ts

// Perfil do Usuário para o Card do Dashboard
export interface UserDashboardProfile {
  name: string;
  username: string;
  avatarUrl?: string; // Opcional, se for usar imagem de perfil dinâmica
  posts: number | string; 
  followers: string; 
  following: number | string;
}

// Dados de um item de post individual
export interface PostItemData {
  id: number | string;
  imageUrl: string;
  altText: string;
  date: string;
  platform: string;
  caption: string;
  likes: string | number;
  comments: string | number;
  shares: string | number;
}

// Estatísticas de Engajamento (para o EngagementCard)
export interface EngagementStatItem {
  count: string; 
  percentage: string; 
}

export interface DashboardEngagementData {
  likes: EngagementStatItem;
  comments: EngagementStatItem;
  shares: EngagementStatItem;
  saves: EngagementStatItem;
}

// Item de Crescimento (para o GrowthCard)
export interface GrowthItem {
  metric: string;
  value: string;
  change: string; 
  changeColor: string; 
  iconBgColor: string; 
  iconTextColor: string; 
  icon: React.ReactNode; // Se você continuar passando o ícone como JSX
}

export interface DashboardGrowthData {
  newFollowers: GrowthItem;
  profileViews: GrowthItem;
  engagementRate: GrowthItem;
}

// Estatísticas de Performance de Conteúdo (para o ContentPerformanceCard)
export interface DashboardPerformanceStats {
  totalContent: string | number;
  averageEngagement: string;
  topPlatform: string;
  createdThisMonth: string | number;
} 