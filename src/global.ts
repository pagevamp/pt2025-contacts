declare global{
    var activeUserId : string
}
globalThis.activeUserId = ""

export function setActiveUser(id: string) {
  globalThis.activeUserId = id
}

export function getActiveUser() {
  return globalThis.activeUserId
}
