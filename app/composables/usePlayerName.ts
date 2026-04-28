const PLAYER_NAME_KEY = 'bob-player-name'

export function usePlayerName() {
  const playerName = useState<string>('playerName', () => '')

  // 客户端初始化：优先从 localStorage 读取
  if (process.client) {
    const stored = localStorage.getItem(PLAYER_NAME_KEY)
    if (stored) {
      playerName.value = stored
    }
  }

  function setName(name: string) {
    const trimmed = name.trim()
    playerName.value = trimmed
    if (process.client) {
      localStorage.setItem(PLAYER_NAME_KEY, trimmed)
    }
  }

  function clearName() {
    playerName.value = ''
    if (process.client) {
      localStorage.removeItem(PLAYER_NAME_KEY)
    }
  }

  const hasName = computed(() => !!playerName.value)
  const isGM = computed(() => playerName.value.toLowerCase() === 'gm')

  return {
    playerName: readonly(playerName),
    setName,
    clearName,
    hasName,
    isGM,
  }
}
