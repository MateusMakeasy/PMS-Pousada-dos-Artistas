# PMS Pousada dos Artistas

## Visão Geral

Este é um sistema de gerenciamento de propriedades (PMS) interno e de custo zero, desenvolvido exclusivamente para a **Pousada dos Artistas**. O projeto foi inspirado na interface e usabilidade do sistema Hospedin, com o objetivo de oferecer uma ferramenta de gestão simples, segura e eficiente, utilizando o ecossistema Serverless do Firebase e com o frontend hospedado na Vercel.

O sistema é projetado para ser **single-tenant**, atendendo unicamente às necessidades da Pousada dos Artistas, e otimizado para operar inteiramente dentro dos limites do plano gratuito do Firebase.

## Estrutura Atual de Camarins

A Pousada dos Artistas possui **29 unidades** de hospedagem, chamadas de "Camarins". O sistema é pré-configurado com essa quantidade, mas permite ajustes futuros, caso necessário.

## Papéis de Usuário (Roles)

O acesso ao sistema é controlado por meio de papéis, garantindo que cada usuário tenha permissões adequadas à sua função.

-   **`admin`**: Acesso total ao sistema, incluindo configurações, gestão de usuários e relatórios.
-   **`gerente`**: Acesso a todas as funcionalidades de reserva, gestão de hóspedes e relatórios financeiros.
-   **`recepcao`**: Acesso focado na operação diária, como check-in, check-out e criação de reservas de balcão.

Todas as ações críticas no sistema são registradas em logs de auditoria para garantir a rastreabilidade.

## Origens de Reserva

Toda reserva deve ser associada a uma origem para fins de rastreamento e relatórios. As origens pré-definidas são:

-   `balcao`: Reservas feitas presencialmente ou por telefone.
-   `booking`: Reservas provenientes da Booking.com.
-   `airbnb`: Reservas provenientes do Airbnb.
-   `hbook`: Reservas provenientes do channel manager Hbook.

## Configuração do Firebase

O backend é 100% baseado no Firebase, utilizando os seguintes serviços:

-   **Firestore**: Banco de dados NoSQL para armazenar todas as informações (reservas, hóspedes, camarins, etc.).
-   **Firebase Authentication**: Para autenticação segura de usuários com e-mail e senha.
-   **Firebase Functions**: Para toda a lógica de backend, incluindo a API para o frontend, webhooks de canais externos e jobs agendados.

### Regras de Segurança (Firestore)

As regras do Firestore (`firestore.rules`) são configuradas para garantir que:
- Apenas usuários autenticados possam ler ou escrever dados.
- A escrita de dados seja restrita de acordo com o papel do usuário.
- Não haja acesso público a nenhuma coleção.

## Integração com o Kommo CRM

Para otimizar o relacionamento com os hóspedes, o sistema se integra ao Kommo CRM.

-   **Gatilho**: A integração não é imediata. Um lead é criado no Kommo CRM exatamente às **00:01 da data de check-in** do hóspede.
-   **Método**: Para evitar custos com o Firebase Scheduler, usamos uma abordagem gratuita:
    1.  Quando uma reserva é confirmada, uma tarefa é registrada na coleção `scheduled_jobs` no Firestore com a data e hora exata da execução.
    2.  Um serviço de cron job externo e gratuito (como o [cron-job.org](https://cron-job.org/) ou um GitHub Action) é configurado para chamar uma função HTTP a cada 5 minutos.
    3.  Essa função (`processScheduledJobs`) verifica a coleção `scheduled_jobs` em busca de tarefas pendentes, processa-as e as marca como concluídas para garantir a **idempotência** (evitando a criação de leads duplicados).
-   **Dados Enviados**: Nome, telefone, e-mail, camarim, data de check-in, origem e valor da reserva.

## Deploy no Vercel

O frontend, desenvolvido com uma estrutura moderna de JavaScript, é hospedado na Vercel, garantindo alta performance, deploy contínuo e custo zero.

Para realizar o deploy:
1. Conecte seu repositório do GitHub à Vercel.
2. Configure o projeto para apontar para a pasta `frontend`.
3. Adicione as variáveis de ambiente do Firebase (fornecidas no console do Firebase) às configurações do projeto na Vercel.
4. O deploy será acionado automaticamente a cada `push` para a branch principal.

## Limites do Plano Gratuito (Spark)

O sistema foi projetado para operar dentro dos limites do plano gratuito do Firebase, que são generosos. No entanto, é importante estar ciente deles:

-   **Firestore**: ~50k leituras/dia, ~20k escritas/dia.
-   **Firebase Functions**: ~2 milhões de invocações/mês.
-   **Firebase Authentication**: 10k usuários/mês.

Com uma estimativa de 300 reservas semanais, a operação se encaixa confortavelmente nesses limites.

## Checklist Antes de Produção

-   [ ] Criar um projeto no [Firebase Console](https://console.firebase.google.com/).
-   [ ] Configurar a autenticação por E-mail/Senha.
-   [ ] Criar o banco de dados Firestore.
-   [ ] Fazer o deploy das regras de segurança (`firestore.rules`).
-   [ ] Fazer o deploy das Firebase Functions.
-   [ ] Configurar as variáveis de ambiente do Firebase no Vercel.
-   [ ] Configurar um serviço de cron job externo para a integração com o Kommo.
-   [ ] Cadastrar os 29 camarins no sistema.
-   [ ] Cadastrar os usuários (`admin`, `gerente`, `recepcao`).
-   [ ] Realizar testes completos de fluxo de reserva e check-in/check-out.
