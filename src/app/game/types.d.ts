export type Role = {
    "name": string,
}

export type Player = {
    "uuid": string,
    "pseudo": string,
    "role": Role,
    "eliminated": boolean,
    "connected": boolean
}

export type GameData = {
    "normalWord": string,
    "undercoverWord": string
}

export type GameState = {
    "state": string
}

export type DescPlayData = {
    "player": Player,
    "word": string
}

export type VoteData = {
    "player": Player,
    "targetPlayer": Player
}

export type GameObject = {
    "uuid": string,
    "started": boolean,
    "ended": boolean,
    "host": Player,
    "players": Array<Player>,
    "gameData": GameData,
    "gameState": GameState,
    "playerTurn": number,
    "descPlayData": Array<DescPlayData>,
    "voteData": Array<VoteData>,
    "lastUpdate": number
}
