import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import * as schema from '../../db/schema'

let client: Client | null = null
let dbInstance: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!dbInstance) {
    const config = useRuntimeConfig()
    const dbUrl = config.dbUrl || 'file:./data/campaign.db'
    
    // 确保data目录存在
    if (dbUrl.startsWith('file:')) {
      const dbPath = dbUrl.replace('file:', '')
      const dir = dirname(dbPath)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    }
    
    client = createClient({ url: dbUrl })
    dbInstance = drizzle(client, { schema })
  }
  return dbInstance
}

export type Db = ReturnType<typeof getDb>
export { schema, eq }

// 生成6位随机房间码
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// 生成GM管理密钥
export function generateGMToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

// 验证GM Token
export async function verifyGMToken(roomId: number, token: string): Promise<boolean> {
  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.id, roomId)).get()
  return room?.gmToken === token
}
