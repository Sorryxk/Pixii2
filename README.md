# RaspadinhaX Full‑Stack + PIX (EFI Adapter)

Stack:
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Prisma (SQLite local) — troque por Postgres em produção
- PIX via adapter (ex.: EFI/Gerencianet)

## Rodar local
```bash
npm i
npm run db:push && npm run db:seed
npm run dev
```
Acesse http://localhost:3000

## Variáveis de ambiente (.env.local)
```
DATABASE_URL="file:./prisma/dev.db"

# PIX
PIX_PROVIDER="efi"
EFI_BASE_URL="https://api.efi.com.br"         # sandbox/produção conforme seu PSP
EFI_CLIENT_ID=""
EFI_CLIENT_SECRET=""
EFI_CERT_PATH="./certs/efi-cert.p12"          # NÃO comite o arquivo!
EFI_CERT_PASS=""
EFI_PIX_KEY="sua-chave-pix"                   # email/cel/aleatória
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # defina a URL pública em produção
```

## Fluxo
1) `/api/checkout` cria `Order` + `Payment` e solicita cobrança imediata ao PSP:
   - `PUT /v2/cob/{txid}`
   - `GET /v2/loc/{id}/qrcode` (BR Code + imagem)
2) UI exibe QR/BR Code.
3) PSP envia webhook para `POST /api/webhooks/pix` após pagamento.
4) App marca `Order.status = PAID` e `Payment.status = PAID`.

> Certificado mTLS: obtenha com seu PSP (arquivo `.p12`/`.pfx`). **Nunca** commit o certificado/segredos.

### Produção
- Autenticação (NextAuth) + RBAC.
- Banco gerenciado (Postgres/Supabase/RDS).
- Observabilidade (logs, métricas) e antifraude.
- Geofencing, KYC/AML, verificação 18+.
- Conciliação e retentativas de webhook.
