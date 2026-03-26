# Requirements Document

## Introduction

Este documento descreve os requisitos para a ativação do site white-label de cada integrador (cliente) no sistema SaaS de energia solar. O problema central é que o fluxo de onboarding não persiste os dados do integrador no banco de dados (tabela `integrators`), fazendo com que a rota `/s/{slug}` retorne "Página não disponível". A solução envolve: geração e persistência do slug durante o onboarding, carregamento correto do site white-label via slug, tratamento de erros amigável, e exibição do link exclusivo no dashboard.

## Glossary

- **Integrator**: Cliente do SaaS que se cadastra e recebe um site white-label próprio
- **Slug**: Identificador único em formato URL-friendly gerado a partir do nome da empresa (ex: "solar-energy-ltda")
- **WhiteLabel_Site**: Site público personalizado do integrador, acessível via `/s/{slug}`
- **Onboarding**: Fluxo de cadastro inicial do integrador composto por 5 etapas
- **Slug_Generator**: Função responsável por converter o nome da empresa em um slug válido e único
- **Integrator_Record**: Registro na tabela `integrators` do Supabase contendo todos os dados do integrador
- **Dashboard**: Painel de controle privado do integrador após o onboarding

---

## Requirements

### Requirement 1: Geração de Slug Durante o Onboarding

**User Story:** Como integrador, quero que meu slug seja gerado automaticamente a partir do nome da minha empresa durante o cadastro, para que eu tenha um link exclusivo sem precisar configurá-lo manualmente.

#### Acceptance Criteria

1. WHEN o integrador preenche o campo "Nome da Empresa" na etapa `/onboarding/company`, THE Slug_Generator SHALL converter o nome em slug no formato kebab-case, removendo acentos, caracteres especiais e espaços
2. WHEN o slug gerado já existir na tabela `integrators`, THE Slug_Generator SHALL adicionar um sufixo numérico incremental ao slug (ex: `solar-energy-2`) até encontrar um slug único
3. THE Onboarding SHALL exibir uma prévia do slug gerado em tempo real enquanto o integrador digita o nome da empresa, no formato `seudominio.com/s/{slug}`
4. WHEN o integrador submete a etapa company, THE Onboarding SHALL salvar os dados da empresa (company_name, slug, user_id, active=true) na tabela `integrators` do Supabase antes de navegar para a próxima etapa
5. IF a operação de inserção na tabela `integrators` falhar, THEN THE Onboarding SHALL exibir uma mensagem de erro descritiva e manter o usuário na etapa atual sem navegar

### Requirement 2: Persistência Completa do Registro do Integrador

**User Story:** Como integrador, quero que todas as informações configuradas durante o onboarding sejam salvas corretamente, para que meu site white-label reflita minhas escolhas de personalização.

#### Acceptance Criteria

1. WHEN o integrador conclui a etapa `/onboarding/branding`, THE Onboarding SHALL atualizar o Integrator_Record com os campos `primary_color`, `secondary_color`, `accent_color` e `logo_url`
2. WHEN o integrador conclui a etapa `/onboarding/plan` e clica em "Começar Trial Grátis", THE Onboarding SHALL atualizar o Integrator_Record com `subscription_plan`, `subscription_status='trial'` e `trial_ends_at` (data atual + 7 dias)
3. THE Integrator_Record SHALL conter `active=true` a partir da etapa company, garantindo que o site white-label seja acessível imediatamente após o onboarding
4. IF o Integrator_Record para o `user_id` autenticado já existir na tabela `integrators`, THEN THE Onboarding SHALL atualizar o registro existente em vez de criar um duplicado

### Requirement 3: Carregamento do Site White-Label via Slug

**User Story:** Como visitante, quero acessar o site white-label de um integrador pelo link `/s/{slug}` e ver um site funcional e personalizado, para que eu possa solicitar um orçamento de energia solar.

#### Acceptance Criteria

1. WHEN um visitante acessa `/s/{slug}`, THE WhiteLabel_Site SHALL buscar o Integrator_Record na tabela `integrators` filtrando por `slug` e `active=true`
2. WHEN o Integrator_Record é encontrado, THE WhiteLabel_Site SHALL renderizar o site com as cores (`primary_color`, `secondary_color`, `accent_color`), logo, textos e chatbot configurados pelo integrador
3. WHEN o Integrator_Record é encontrado e não possui kits cadastrados, THE WhiteLabel_Site SHALL renderizar o chatbot sem a etapa de recomendação de kit, exibindo uma mensagem padrão de contato
4. WHILE o Integrator_Record está sendo carregado do Supabase, THE WhiteLabel_Site SHALL exibir um indicador de carregamento (spinner) centralizado na tela

### Requirement 4: Página de Erro Amigável para Slug Inválido ou Inativo

**User Story:** Como visitante, quero ver uma mensagem clara quando acesso um link de integrador inválido ou inativo, para que eu entenda o que aconteceu e saiba o que fazer.

#### Acceptance Criteria

1. IF o slug acessado não existir na tabela `integrators`, THEN THE WhiteLabel_Site SHALL exibir uma página de erro com título "Página não encontrada", descrição explicativa e um botão de retorno à página inicial
2. IF o Integrator_Record existir mas `active=false`, THEN THE WhiteLabel_Site SHALL exibir uma página de erro com título "Site temporariamente indisponível" e uma mensagem orientando o visitante a entrar em contato com o integrador
3. IF ocorrer um erro de rede ou falha na consulta ao Supabase, THEN THE WhiteLabel_Site SHALL exibir uma página de erro com título "Erro ao carregar a página" e um botão para tentar novamente
4. THE WhiteLabel_Site SHALL retornar HTTP status 404 semanticamente para slugs inexistentes, utilizando o componente de erro adequado do React Router

### Requirement 5: Exibição do Link Exclusivo no Dashboard

**User Story:** Como integrador, quero ver meu link white-label exclusivo no dashboard, para que eu possa compartilhá-lo facilmente com meus clientes.

#### Acceptance Criteria

1. WHEN o integrador acessa `/dashboard/home`, THE Dashboard SHALL buscar o Integrator_Record associado ao `user_id` autenticado e exibir o link no formato `{baseUrl}/s/{slug}`
2. THE Dashboard SHALL exibir um botão "Copiar Link" ao lado do link exclusivo que, WHEN clicado, THE Dashboard SHALL copiar o link para a área de transferência e exibir uma confirmação visual (toast)
3. IF o Integrator_Record não for encontrado para o `user_id` autenticado, THEN THE Dashboard SHALL exibir uma mensagem orientando o integrador a completar o onboarding com um link de redirecionamento para `/onboarding/company`
4. THE Dashboard SHALL exibir o slug do integrador como texto somente leitura, sem permitir edição direta nesta tela

### Requirement 6: Unicidade e Formato do Slug

**User Story:** Como sistema, preciso garantir que cada slug seja único e siga um formato válido para URLs, para que não haja conflitos entre integradores e os links funcionem corretamente.

#### Acceptance Criteria

1. THE Slug_Generator SHALL produzir slugs contendo apenas letras minúsculas (a-z), números (0-9) e hífens (-), sem espaços ou caracteres especiais
2. THE Slug_Generator SHALL converter caracteres acentuados para seus equivalentes sem acento (ex: "ção" → "cao", "ê" → "e")
3. THE Slug_Generator SHALL remover hífens duplicados consecutivos e hífens no início ou fim do slug resultante
4. THE Slug_Generator SHALL garantir que o slug tenha no mínimo 3 caracteres e no máximo 60 caracteres
5. IF o nome da empresa resultar em um slug com menos de 3 caracteres após a normalização, THEN THE Slug_Generator SHALL complementar o slug com um sufixo numérico aleatório de 4 dígitos
