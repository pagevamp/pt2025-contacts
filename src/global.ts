declare global{
    var activeUserId : string
}
globalThis.activeUserId = ""

export function setActiveUser(userName: string) {
  globalThis.activeUserId = userName
}

export function getActiveUser() {
  return globalThis.activeUserId
}
