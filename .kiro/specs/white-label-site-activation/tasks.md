# Implementation Plan: white-label-site-activation

## Overview

Implementar a ativação do site white-label: geração e persistência do slug no onboarding, carregamento robusto da página pública via slug, tratamento de erros amigável e exibição do link exclusivo no dashboard.

## Tasks

- [x] 1. Criar `src/lib/slug.ts` com as funções de geração de slug
  - Implementar `generateSlug(companyName: string): string` seguindo o algoritmo de normalização NFD, remoção de diacríticos, lowercase, substituição de caracteres inválidos por hífen, remoção de hífens duplicados/bordas, truncamento em 60 chars e sufixo de 4 dígitos se length < 3
  - Implementar `ensureUniqueSlug(baseSlug: string, supabaseClient: SupabaseClient): Promise<string>` com injeção de dependência do cliente Supabase, tentando sufixos incrementais (-2, -3, ...) até encontrar slug livre, com limite de 100 tentativas
  - Exportar também `buildWhiteLabelUrl(slug: string): string` que retorna `${window.location.origin}/s/${slug}`
  - _Requirements: 1.1, 1.2, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 1.1 Instalar fast-check como devDependency
    - Executar `npm install --save-dev fast-check`

  - [ ]* 1.2 Escrever testes de propriedade para `generateSlug` (Property 1 e 2)
    - **Property 1: Formato válido do slug** — para qualquer string de entrada, o slug deve conter apenas `[a-z0-9-]`, não começar/terminar com hífen e não ter hífens consecutivos
    - **Validates: Requirements 1.1, 6.1, 6.2, 6.3**
    - **Property 2: Tamanho do slug** — para qualquer string com pelo menos um caractere alfanumérico, o slug deve ter entre 3 e 60 caracteres
    - **Validates: Requirements 6.4, 6.5**
    - Criar arquivo `src/test/slug.test.ts`

  - [ ]* 1.3 Escrever teste de propriedade para `ensureUniqueSlug` (Property 3)
    - **Property 3: Unicidade do slug** — para qualquer conjunto de slugs existentes, `ensureUniqueSlug` deve retornar um slug ausente nesse conjunto
    - **Validates: Requirements 1.2**
    - Usar mock do Supabase client via `vi.fn()`

  - [ ]* 1.4 Escrever teste de propriedade para `buildWhiteLabelUrl` (Property 7)
    - **Property 7: Formato do link no dashboard** — para qualquer slug `s`, o resultado deve ser `${window.location.origin}/s/${s}`
    - **Validates: Requirements 5.1**

- [x] 2. Modificar `src/pages/onboarding/Company.tsx` — persistir registro do integrador
  - Importar `generateSlug`, `ensureUniqueSlug` de `@/lib/slug`
  - Importar `supabase` de `@/integrations/supabase/client` e `useAuth` de `@/contexts/AuthContext`
  - Adicionar estado `isLoading` e exibir prévia do slug em tempo real abaixo do campo "Nome da Empresa" no formato `seudominio.com/s/{slug}` (derivado de `generateSlug(formData.companyName)`)
  - No `handleSubmit`: chamar `ensureUniqueSlug`, depois `supabase.from('integrators').insert({ company_name, slug, user_id: user.id, active: true })`; em caso de erro exibir toast descritivo e não navegar; em caso de sucesso navegar para `/onboarding/whatsapp`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4_

  - [ ]* 2.1 Escrever testes unitários para Company.tsx
    - Testar exibição da prévia do slug ao digitar o nome da empresa
    - Testar que, em caso de erro no INSERT, o toast de erro é exibido e não há navegação
    - Testar que, em caso de sucesso, navega para `/onboarding/whatsapp`

- [x] 3. Modificar `src/pages/onboarding/Branding.tsx` — persistir cores e logo
  - Importar `supabase` e `useAuth`
  - Adicionar estado para `primaryColor`, `secondaryColor`, `accentColor` e `logoUrl` (inicializados com os valores do preset selecionado)
  - No handler do botão "Continuar": `supabase.from('integrators').update({ primary_color, secondary_color, accent_color, logo_url }).eq('user_id', user.id)`; em caso de erro exibir toast e não navegar; em caso de sucesso navegar para `/onboarding/plan`
  - _Requirements: 2.1_

- [x] 4. Modificar `src/pages/onboarding/Plan.tsx` — persistir plano e ativar trial
  - Importar `supabase` e `useAuth`
  - No `handleFinish`: `supabase.from('integrators').update({ subscription_plan: selectedPlan, subscription_status: 'trial', trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }).eq('user_id', user.id)`; em caso de erro exibir toast e não navegar; em caso de sucesso exibir toast de sucesso e navegar para `/dashboard/home`
  - _Requirements: 2.2_

  - [ ]* 4.1 Escrever teste de propriedade para o cálculo de `trial_ends_at` (Property 5)
    - **Property 5: Trial ends_at é 7 dias no futuro** — para qualquer instante `now`, `trial_ends_at` deve ser `now + 7 * 24 * 60 * 60 * 1000` com tolerância de ±1 segundo
    - **Validates: Requirements 2.2**
    - Extrair a lógica de cálculo para uma função pura `calcTrialEndsAt(now: number): string` e testá-la

- [x] 5. Checkpoint — Garantir que as etapas do onboarding persistem dados corretamente
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Modificar `src/pages/public/WhiteLabelPage.tsx` — distinguir tipos de erro
  - Adicionar tipo `type ErrorType = 'not_found' | 'inactive' | 'network_error' | null`
  - Substituir o estado `error: boolean` por `errorType: ErrorType`
  - Ajustar `loadIntegrator`: remover o filtro `.eq('active', true)` da query; após receber resposta, definir `errorType` conforme: `error` → `'network_error'`, `!data` → `'not_found'`, `!data.active` → `'inactive'`
  - Renderizar três componentes de erro distintos:
    - `not_found`: título "Página não encontrada", descrição explicativa, botão "Voltar ao início" (`/`)
    - `inactive`: título "Site temporariamente indisponível", mensagem orientando contato com o integrador
    - `network_error`: título "Erro ao carregar a página", botão "Tentar novamente" que chama `loadIntegrator(slug)` novamente
  - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4_

  - [ ]* 6.1 Escrever testes unitários para WhiteLabelPage.tsx
    - Testar exibição do spinner durante loading
    - Testar renderização da página de erro `not_found`
    - Testar renderização da página de erro `inactive`
    - Testar renderização da página de erro `network_error` com botão "Tentar novamente"
    - **Property 8: Filtragem por active** — se `active = false`, a página não deve renderizar o conteúdo do integrador
    - **Validates: Requirements 3.1, 4.2**

- [x] 7. Modificar `src/pages/dashboard/Home.tsx` — exibir link exclusivo
  - Importar `supabase`, `useAuth`, `buildWhiteLabelUrl` de `@/lib/slug`
  - Adicionar `useEffect` que busca `integrators` filtrando por `user_id` do usuário autenticado
  - Exibir card com o link `buildWhiteLabelUrl(integrator.slug)` como texto somente leitura e botão "Copiar Link" que usa `navigator.clipboard.writeText` + toast de confirmação
  - Se não encontrar registro: exibir card com mensagem "Complete seu cadastro para ativar seu site" e link para `/onboarding/company`
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.1 Escrever testes unitários para Dashboard Home.tsx
    - Testar exibição do link e botão "Copiar Link" quando integrador existe
    - Testar que o botão "Copiar Link" chama `navigator.clipboard.writeText` com o link correto
    - Testar exibição do card de onboarding incompleto quando não há registro

- [x] 8. Modificar `src/pages/dashboard/Home.tsx` — conectar botões de ação rápida às rotas
  - Importar `useNavigate` de `react-router-dom`
  - Conectar botão "Ver Todos os Leads" → navegar para `/dashboard/leads`
  - Conectar botão "Editar Fluxo de Conversa" → navegar para `/dashboard/flows`
  - Conectar botão "Ver Orçamentos" → navegar para `/dashboard/kits`
  - Adicionar `onClick` handlers em cada botão com `navigate(rota)`
  - _Requirements: Melhoria de UX no dashboard_

- [x] 9. Checkpoint final — Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia os requisitos específicos para rastreabilidade
- `ensureUniqueSlug` recebe o cliente Supabase por injeção de dependência para facilitar testes
- A lógica de `calcTrialEndsAt` deve ser extraída como função pura para permitir o teste de propriedade (Property 5)
- Testes de propriedade usam fast-check com mínimo de 100 iterações cada
