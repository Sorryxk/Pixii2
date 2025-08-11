import axios from 'axios'
import https from 'https'
import fs from 'fs'
import path from 'path'

export type PixCharge = {
  txid: string
  brcode: string
  qrImage?: string
  expiresAt?: string
  raw?: any
}

export interface PixProvider {
  createImmediateCharge(params: { amount: number; txid?: string; payerName?: string; payerCpfCnpj?: string; description?: string }): Promise<PixCharge>
}

export class EfiPixProvider implements PixProvider {
  private base = process.env.EFI_BASE_URL || 'https://api.efi.com.br'
  private clientId = process.env.EFI_CLIENT_ID || ''
  private clientSecret = process.env.EFI_CLIENT_SECRET || ''
  private certPath = process.env.EFI_CERT_PATH || '' // .p12 or .pfx
  private certPass = process.env.EFI_CERT_PASS || ''

  private async token(){
    const pfx = fs.readFileSync(path.resolve(this.certPath))
    const agent = new https.Agent({ pfx, passphrase: this.certPass })
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    const r = await axios.post(`${this.base}/oauth/token`, 'grant_type=client_credentials', {
      httpsAgent: agent,
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    return { access_token: r.data.access_token, agent }
  }

  async createImmediateCharge(params: { amount: number; txid?: string; payerName?: string; payerCpfCnpj?: string; description?: string }): Promise<PixCharge> {
    const { access_token, agent } = await this.token()
    // Cria cobrança imediata
    const body: any = {
      calendario: { expiracao: 3600 },
      valor: { original: params.amount.toFixed(2) },
      chave: process.env.EFI_PIX_KEY, // sua chave Pix (email/celular/aleatória)
      solicitacaoPagador: params.description || 'RaspadinhaX',
    }
    if (params.payerName && params.payerCpfCnpj){
      body.devedor = { nome: params.payerName, cpf: params.payerCpfCnpj.replace(/\D/g,'') }
    }
    const txid = params.txid || Math.random().toString(36).slice(2,12)
    const r1 = await axios.put(`${this.base}/v2/cob/${txid}`, body, { httpsAgent: agent, headers:{ Authorization: `Bearer ${access_token}` } })
    const locId = r1.data.loc && r1.data.loc.id
    // Obtém BR Code e QR
    const r2 = await axios.get(`${this.base}/v2/loc/${locId}/qrcode`, { httpsAgent: agent, headers:{ Authorization: `Bearer ${access_token}` } })
    return {
      txid,
      brcode: r2.data.qrcode,
      qrImage: r2.data.imagemQrcode,
      expiresAt: new Date(Date.now()+3600*1000).toISOString(),
      raw: { cob: r1.data, qrcode: r2.data }
    }
  }
}

export function getProvider(): PixProvider {
  const provider = (process.env.PIX_PROVIDER || 'efi').toLowerCase()
  if (provider === 'efi') return new EfiPixProvider()
  throw new Error('PIX_PROVIDER não suportado')
}
