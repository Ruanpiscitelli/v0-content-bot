# Virallyzer - AI Content Creation Platform

*Your Expert Content Assistant for creating viral content and social media engagement*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/piscitelliruan-gmailcoms-projects/v0-content-bot)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/jZfCydkdNIa)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 🚀 Overview

Virallyzer é uma plataforma completa de criação de conteúdo alimentada por IA, projetada para ajudar criadores de conteúdo a desenvolver estratégias virais e engaging para redes sociais.

### ✨ Principais Funcionalidades

- 🤖 **Chat com IA** - Assistente especializado em criação de conteúdo
- 💡 **Banco de Ideias** - Gerencie e organize suas ideias criativas
- 📅 **Calendar** - Planejamento e agendamento de conteúdo
- 📈 **Trends** - Análise de tendências em tempo real
- 🛠️ **Tools Suite** - Ferramentas de geração de conteúdo:
  - Geração de Imagens
  - Geração de Vídeos
  - Geração de Áudio
  - Face Swap
  - Lip Sync
- 🖼️ **Gallery** - Galeria de conteúdos gerados
- ⚙️ **Settings** - Configurações de conta e assinatura

## 🏗️ Arquitetura Técnica

### Stack Principal
- **Frontend**: Next.js 15.3.2 com TypeScript
- **Styling**: TailwindCSS com Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Services**: Replicate API para geração de conteúdo
- **Deployment**: Vercel

### Estrutura do Projeto
```
v0-content-bot/
├── app/                    # App Router (Next.js 13+)
│   ├── (app)/             # Rotas protegidas da aplicação
│   ├── (landing)/         # Landing page pública
│   ├── api/               # API routes
│   └── components/        # Componentes específicos de páginas
├── components/            # Componentes reutilizáveis
│   ├── auth/             # Componentes de autenticação
│   ├── ui/               # Componentes UI base
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utilitários e configurações
├── supabase/             # Migrations e configurações do Supabase
└── types/                # Definições de tipos TypeScript
```

## 🔧 Últimas Alterações (30/05/2025)

### ✅ Correção do Sistema de Perfis de Usuário

**Problema Resolvido**: O nome do usuário não estava aparecendo corretamente na sidebar, mostrando "User" em vez do nome real.

**Soluções Implementadas**:

1. **Correção da Sidebar** (`components/app-sidebar.tsx`):
   - Corrigido objeto `userData` que retornava `undefined`
   - Implementado fallback adequado para exibição do nome

2. **Melhorias no Hook useProfile** (`hooks/useProfile.ts`):
   - Adicionada criação automática de perfil quando não existe
   - Implementado `upsert` em vez de `update` para maior robustez
   - Melhor tratamento de erros PGRST116 (row not found)

3. **Setup do Banco de Dados**:
   - Verificação e criação de perfis para usuários existentes
   - Perfil do usuário principal criado com sucesso:
     - Nome: "Ruan Piscitelli"
     - Username: "piscitelliruan"

**Resultado**: Sistema de perfis agora funciona corretamente, com criação automática de perfils para novos usuários e exibição adequada do nome na interface.

## 🛠️ Configuração do Desenvolvimento

### Pré-requisitos
- Node.js 18+
- PNPM (recomendado)
- Conta Supabase
- Conta Replicate

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Ruanpiscitelli/v0-content-bot.git
cd v0-content-bot
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Preencha com suas credenciais:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REPLICATE_API_TOKEN`

4. Execute as migrações do Supabase:
```bash
pnpm run db:migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

### Scripts Disponíveis

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Build para produção
- `pnpm start` - Inicia servidor de produção
- `pnpm lint` - Executa linting
- `pnpm type-check` - Verificação de tipos TypeScript

## 🚀 Deploy

### Vercel (Recomendado)

O projeto está configurado para deploy automático no Vercel:

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na main

**URL de Produção**: [https://vercel.com/piscitelliruan-gmailcoms-projects/v0-content-bot](https://vercel.com/piscitelliruan-gmailcoms-projects/v0-content-bot)

## 📝 Funcionalidades em Desenvolvimento

- [ ] Sistema de analytics avançado
- [ ] Integração com mais redes sociais
- [ ] Templates de conteúdo pré-definidos
- [ ] Sistema de colaboração em equipe
- [ ] API pública para desenvolvedores

## 🤝 Contribuição

Este é um projeto pessoal em desenvolvimento ativo. Sugestões e feedback são sempre bem-vindos!

## 📞 Contato

- **GitHub**: [@Ruanpiscitelli](https://github.com/Ruanpiscitelli)
- **Email**: piscitelliruan@gmail.com

## 📄 Licença

Este projeto é de propriedade privada. Todos os direitos reservados.

---

*Construído com ❤️ usando v0.dev e Next.js*