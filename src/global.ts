declare global{
    var activeUserId : string | null
}
globalThis.activeUserId = null

export function setActiveUser(id: string) {
  globalThis.activeUserId = id
}

export function getActiveUser() {
  return globalThis.activeUserId
}
