# Desafio Sprint 07 — Angular | Dashboard Ford

Projeto desenvolvido para o desafio da Sprint 07 (TypeScript/Angular), seguindo as
3 telas pedidas: **Login**, **Home** e **Dashboard**.

⚠️ **Importante:** este projeto usa a API fornecida pelo professor
(`api-professor/`, baseada no `Api-Sprint7-main.zip`), **e não** a API que veio
junto com o arquivo de suporte do Word (`api_ford`). Por isso:
- A API roda em **http://localhost:3001** (e não na porta 3000 citada no Word).
- O endpoint de listagem de veículos é `GET /vehicles` (não `/vehicle`).
- O endpoint de dados do veículo é `POST /vehicleData` com `{ "vin": "..." }` no
  corpo da requisição (não GET).

## Estrutura

```
desafio-sprint7-angular/
├── api-professor/        # API do professor (Express) — porta 3001
│   ├── api.js
│   ├── img/               # imagens dos veículos servidas pela API
│   └── package.json        # criado manualmente (o zip original só tinha api.js)
└── ford-dashboard/        # Aplicação Angular 21 (o front-end do desafio)
    └── src/app/
        ├── core/
        │   ├── guards/auth-guard.ts        # protege /home e /dashboard
        │   ├── models/usuario.model.ts     # modelos fornecidos pelo Word (ajustados)
        │   ├── models/veiculo.model.ts
        │   └── services/auth.ts            # POST /login
        │   └── services/vehicle.ts         # GET /vehicles, POST /vehicleData
        └── features/
            ├── login/login-page         # Ação 1
            ├── home/home-page           # Ação 2
            └── dashboard/dashboard-page  # Ação 3
```

## Como rodar

### 1) Subir a API do professor

```bash
cd api-professor
npm install
npm start
```
A API sobe em **http://localhost:3001**.

### 2) Subir o front-end Angular

Em outro terminal:
```bash
cd ford-dashboard
npm install
npm start
```
(equivalente a `ng serve`). Acesse **http://localhost:4200**.

### 3) Login
- Usuário: `admin`
- Senha: `123456`

## O que foi implementado (mapeado aos critérios de avaliação)

- **Modules, components e services do Angular**: `core` (services/guards/models)
  + 3 feature modules com lazy loading (`login`, `home`, `dashboard`).
- **TypeScript**: interfaces/models tipados (`Usuario`, `Veiculo`, `VeiculoData`,
  `LoginResponse`), tipagem em todos os componentes e services.
- **Comunicação com o back-end**: `HttpClient` (`AuthService`, `VehicleService`)
  consumindo `POST /login`, `GET /vehicles`, `POST /vehicleData`.
- **Bootstrap**: layout, cards, tabela, formulário, botões, badges.
- **Diretivas Angular**: `ngModel` (forms de login e busca), `*ngIf` (estados de
  erro/carregamento/seleção), `*ngFor` (sugestões de busca e tabela).
- **RxJS**: `map`, `pluck` (extração de `vehicles` da resposta), `debounceTime`,
  `distinctUntilChanged` e `filter` na busca por modelo (Passo 8) e na busca por
  VIN (Passo 11).
- **Signals**: o projeto foi gerado com Angular 21 (zoneless por padrão), então o
  estado atualizado dentro de `.subscribe()` usa `signal()` para garantir que a
  tela reaja corretamente às respostas assíncronas da API.

## Observações
- O VIN de exemplo do Word (`2FRHDUYS2Y63NHD22454`) funciona normalmente na
  tabela do Dashboard.
- O guard de autenticação (`authGuard`) usa `localStorage` para persistir a
  sessão e protege as rotas `/home` e `/dashboard`.
