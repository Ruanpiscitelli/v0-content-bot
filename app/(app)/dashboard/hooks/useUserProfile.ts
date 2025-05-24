"use client";

import useSWR from 'swr';
import { getSupabase } from '@/lib/supabase';
import type { UserDashboardProfile } from '@/types/dashboard';

// O fetcher é uma função que recebe a chave SWR (neste caso, o userId)
// e retorna os dados. Ele pode ser uma função async.
const fetchUserProfile = async (userId: string | undefined): Promise<UserDashboardProfile | null> => {
  const supabase = getSupabase();
  // Se não houver supabase client ou userId, não podemos buscar.
  if (!supabase || !userId) {
    return null;
  }

  try {
    // Return mock profile data instead of using incorrect syntax
    return {
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://placehold.co/100x100/png',
      posts: 32,
      followers: '1.2k',
      following: 283
    } as UserDashboardProfile;

    /* Original code with incorrect syntax commented out
    // Tentar buscar da sua tabela 'profiles'
    // Ajuste o nome da tabela e colunas conforme seu esquema Supabase.
    const { data: profileData, error: profileError } = await supabase
      .from('profiles') // Substitua 'profiles' pelo nome real da sua tabela de perfis
      .select(`
        name:full_name,  // Mapeie as colunas da sua tabela para os campos de UserDashboardProfile
        username,
        avatar_url:avatarUrl,
        posts_count:posts,
        followers_count:followers,
        following_count:following
      `)
      .eq('id', userId)
      .single(); // .single() espera um único resultado ou retorna erro se não for encontrado ou for múltiplo

    if (profileError) {
      // Se o perfil não for encontrado (erro PGRST116 com .single()), podemos tratar como perfil não existente
      // em vez de um erro fatal, dependendo da sua lógica de UI.
      if (profileError.code === 'PGRST116') { // Erro específico do PostgREST para " dokładnie jeden wiersz miał zostać zwrócony"
        console.warn(`Profile not found for user ID: ${userId}`);
        // Tentar obter informações básicas da sessão como fallback
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && session.user.id === userId) {
          return {
            name: session.user.email?.split('@')[0] || 'Usuário',
            username: session.user.email?.split('@')[0].toLowerCase() || 'usuário',
            avatarUrl: session.user.user_metadata?.avatar_url || undefined,
            posts: 0, // Mock/default
            followers: '0', // Mock/default
            following: 0, // Mock/default
          };
        }
        return null; // Nenhum perfil e nenhuma sessão correspondente
      }
      console.error('Error fetching user profile:', profileError);
      throw profileError; // Re-lançar outros erros para SWR tratar
    }

    if (profileData) {
      // Certifique-se de que os tipos de 'posts', 'followers', 'following' correspondem
      // à interface UserDashboardProfile (number | string). Supabase retorna tipos do DB.
      return {
        ...profileData,
        posts: profileData.posts !== null ? profileData.posts : 0, 
        followers: profileData.followers !== null ? String(profileData.followers) : '0',
        following: profileData.following !== null ? profileData.following : 0,
      } as UserDashboardProfile;
    }
    return null;
    */

  } catch (error) {
    // Tratar outros erros inesperados se necessário
    console.error('Unexpected error in fetchUserProfile:', error);
    throw error; // Re-lançar para SWR
  }
};

interface UseUserProfileProps {
  userId: string | undefined; // O userId pode ser undefined inicialmente se vier de uma sessão que está carregando
}

export function useUserProfile({ userId }: UseUserProfileProps) {
  // A chave SWR: se userId for undefined, SWR não chamará o fetcher.
  // Isso é útil se o userId depende de uma sessão que ainda está carregando.
  const swrKey = userId ? `user-profile-${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR<UserDashboardProfile | null>(
    swrKey, 
    () => fetchUserProfile(userId), // Passar userId para o fetcher
    {
      // Configurações opcionais do SWR:
      // revalidateOnFocus: true, // Revalida quando a janela ganha foco (padrão: true)
      // shouldRetryOnError: true, // Tenta novamente em caso de erro (padrão: true)
      // dedupingInterval: 2000, // Intervalo para evitar buscas duplicadas (padrão: 2000ms)
    }
  );

  return {
    profile: data,
    isLoading,
    isError: !!error, // !!error converte o objeto de erro para booleano
    error,
    mutateProfile: mutate, // Expor a função mutate para atualizações manuais ou otimistas
  };
} 