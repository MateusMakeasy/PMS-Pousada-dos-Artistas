# Schema do Firestore - Pousada dos Artistas

Este documento descreve a estrutura das coleções no banco de dados Firestore, projetado para o PMS da Pousada dos Artistas.

---

## `users`

Armazena informações sobre os usuários do sistema interno.

-   **Document ID**: `auth_uid` (o mesmo UID do Firebase Authentication)
-   **Campos**:
    -   `name` (string): Nome do usuário. Ex: "João da Silva"
    -   `email` (string): E-mail de login.
    -   `role` (string): Papel do usuário (`admin`, `gerente`, `recepcao`).
    -   `createdAt` (timestamp): Data de criação do registro.

---

## `camarins`

Representa os quartos (Camarins) da pousada.

-   **Document ID**: Auto-gerado pelo Firestore
-   **Campos**:
    -   `name` (string): Nome ou número do camarim. Ex: "Camarim 101", "Suíte Master"
    -   `capacity` (number): Número máximo de hóspedes.
    -   `status` (string): Status do camarim (`active`, `inactive`).
    -   `createdAt` (timestamp): Data de criação do registro.
    -   `updatedAt` (timestamp): Data da última atualização.

---

## `guests`

Armazena o cadastro de hóspedes que já passaram pela pousada.

-   **Document ID**: Auto-gerado pelo Firestore
-   **Campos**:
    -   `name` (string): Nome completo do hóspede.
    -   `email` (string): E-mail do hóspede (usado para busca e contato).
    -   `phone` (string): Telefone do hóspede.
    -   `createdAt` (timestamp): Data de criação do registro.
    -   `lastStay` (timestamp): Data do último check-out.

---

## `reservations`

O coração do sistema. Armazena todas as informações de uma reserva.

-   **Document ID**: Auto-gerado pelo Firestore
-   **Campos**:
    -   `camarimId` (reference): Referência ao documento na coleção `camarins`.
    -   `guestId` (reference): Referência ao documento na coleção `guests`.
    -   `checkinDate` (timestamp): Data e hora do check-in.
    -   `checkoutDate` (timestamp): Data e hora do check-out.
    -   `numberOfGuests` (number): Quantidade de hóspedes na reserva.
    -   `totalValue` (number): Valor total da reserva.
    -   `origin` (string): Origem da reserva (`balcao`, `booking`, `airbnb`, `hbook`).
    -   `status` (string): Status atual (`confirmed`, `cancelled`, `checked-in`, `checked-out`).
    -   `internalNotes` (string): Observações internas para a equipe.
    -   `createdAt` (timestamp): Data de criação da reserva.
    -   `updatedAt` (timestamp): Data da última modificação.

---

## `availability`

Controla a disponibilidade de cada camarim por dia, para evitar overbooking.

-   **Document ID**: `camarimId_YYYY-MM-DD` (Ex: `abc123_2024-12-25`)
-   **Campos**:
    -   `camarimId` (string): ID do camarim.
    -   `date` (timestamp): Dia específico.
    -   `status` (string): `available` ou `occupied`.
    -   `reservationId` (reference, opcional): Referência à reserva que está ocupando a data.

---

## `integrations`

Armazena configurações de integrações externas, como chaves de API e webhooks.

-   **Document ID**: Nome da integração (Ex: `kommo`, `booking`)
-   **Campos**:
    -   `apiKey` (string): Chave de API (se aplicável).
    -   `webhookUrl` (string): URL do webhook (se aplicável).
    -   `isEnabled` (boolean): Flag para ativar/desativar a integração.

---

## `scheduled_jobs`

Fila de tarefas a serem executadas em um horário específico, como a integração com o Kommo CRM.

-   **Document ID**: Auto-gerado pelo Firestore
-   **Campos**:
    -   `type` (string): Tipo de job (Ex: `CREATE_KOMMO_LEAD`).
    -   `payload` (map): Dados necessários para executar o job (Ex: dados da reserva).
    -   `executeAt` (timestamp): Data e hora em que o job deve ser executado.
    -   `status` (string): `pending`, `completed`, `error`.
    -   `processedAt` (timestamp, opcional): Data em que o job foi processado.

---

## `audit_logs`

Registra ações importantes realizadas no sistema para fins de auditoria.

-   **Document ID**: Auto-gerado pelo Firestore
-   **Campos**:
    -   `userId` (string): ID do usuário que realizou a ação.
    -   `userName` (string): Nome do usuário.
    -   `userRole` (string): Papel do usuário (`admin`, `gerente`, `recepcao`).
    -   `action` (string): Ação realizada (Ex: `CREATE_RESERVATION`, `CANCEL_RESERVATION`).
    -   `entity` (string): Coleção afetada (Ex: `reservations`).
    -   `entityId` (string): ID do documento afetado.
    -   `changes` (map): Detalhes da alteração (antes e depois).
    -   `createdAt` (timestamp): Data e hora da ação.
