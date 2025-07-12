import Upgrades from "./Upgrades.js"

const gridWidth = 60
const gridHeight = 60
const upgrades = new Upgrades()

export default {
    maxScreenWidth: 1920,
    maxScreenHeight: 1080,
    map: {
        width: 10000,
        height: 10000
    },
    maxLeaderboardItems: 10,
    maxNicknameLength: 15,
    maxChatLength: 40,
    maxClanNameLength: 8,
    updateTickRate: 1000 / 70,
    collisionDepth: 9,
    gatherAngle: Math.PI / 2.6,
    sendLeaderboardDataDelay: 1000,
    sendMinimapDataDelay: 1000,
    maxSkinsLength: 15,
    windmillGoldDelay: 1000,
    dayNightCycleDelay: 480000,
    noEffectsTime: 3000,
    player: {
        scale: 35,
        speed: .67,
        maxHealth: 100,
        maxXPs: [
            400, 650, 850, 1000, 1100, 1250,
            1400, 1550, 1680, 1720, 1840, 2000,
            2250, 2360, 2550, 2625, 2800, 2900,
            2950, 3050, 3225, 3345, 3500, 3550,
            3650, 3725, 3850, 3925, 4000, 4200,
            4250, 4325, 4400, 4575, 4635, 4800,
            4925, 5150, 5250, 5500, 6000, 6500,
            7000, 7750, 8500, 9000, 10000, 11111,
            15000, 20000, 30000, 40000, 50000,
            100000
        ],
        gatherEarnXPMult: 5,
        startResources: [ 9999999, 9999999, 9999999, 9999999 ],
        startWeapons: [ 0, null ],
        startItems: [ 0, 2, 5, null, null ], // food, wall, spike, windmill, trap/boost
        levelsUpgrades: upgrades.list
    },
    grid: {
        width: gridWidth,
        height: gridHeight
    },
    animals: {
        nightSpeedMult: 1.4,
        nightDamageMult: 1.5,
        nightAggresiveZoneRangeMult: 1.35
    },
    resources: {
        generate: {
            berrybush: 40,
            blueberrybush: 35,
            tree: 40,
            stone: 40,
            gold: 8
        },
        tree: {
            type: 0,
            name: "tree",
            gatherName: "wood",
            width: gridWidth * 2.25,
            height: gridHeight * 2.25,
            rndScales: [ 20, 30, 40, 45 ],
            needsCells: 16,
            colDiv: .4,
            hitColMult: 1.35,
            ignoreCollision: false
        },
        stone: {
            type: 1,
            name: "stone",
            gatherName: "stone",
            width: gridWidth * 1.4,
            height: gridHeight * 1.4,
            rndScales: [ 0, 10, 20, 25 ],
            needsCells: 16,
            colDiv: .95,
            ignoreCollision: false
        },
        gold: {
            type: 2,
            name: "gold",
            gatherName: "gold",
            width: gridWidth * 1.475,
            height: gridHeight * 1.475,
            rndScales: [ 0, 10, 20, 25 ],
            needsCells: 16,
            colDiv: .95,
            ignoreCollision: false
        },
        berrybush: {
            type: 3,
            name: "berrybush",
            gatherName: "food",
            width: gridWidth * 1.3,
            height: gridHeight * 1.3,
            needsCells: 9,
            colDiv: .6,
            ignoreCollision: false,
            maxBerries: 5,
            spawnBerrieDelay: 7000,
            berrieFoodAmount: 20,
            needFoodID: 0
        },
        blueberrybush: {
            type: 4,
            name: "blueberrybush",
            gatherName: "food",
            width: gridWidth * 1.3,
            height: gridHeight * 1.3,
            needsCells: 9,
            colDiv: .6,
            ignoreCollision: false,
            maxBerries: 5,
            spawnBerrieDelay: 7000,
            berrieFoodAmount: 25,
            needFoodID: 1
        }
    },
    encodeInts: [
        205.96186761997618,
        135.8709684851607,
        210.78061693549472,
        156.02210198642015
    ],
    packets: {
        setupGame: 111,
        disconnect: 321,
        addPlayer: 453,
        removePlayer: 527,
        updatePlayers: 458,
        gatherAnimation: 276,
        killPlayer: 629,
        changeHealth: 837,
        updateLeaderboard: 644,
        updateResource: 296,
        addGameObject: 945,
        removeGameObject: 855,
        objectWiggle: 174,
        chatMessage: 833,
        updateBushBerries: 672,
        updateLevel: 643,
        updateItems: 103,
        updateUpgradesItems: 172,
        updateItemsCount: 431,
        changeGameObjectHealth: 803,
        updateClans: 178,
        updateClanMembers: 201,
        updateClanRequests: 219,
        joinedClan: 202,
        leaveClan: 221,
        pingResponse: 289,
        updateMinimap: 534,
        addAnimal: 984,
        removeAnimal: 992,
        updateAnimals: 978,
        addText: 777,
        dayNightCycle: 225,
        dayNightCycleNotice: 226
    },
    events: {
        spawn: 132,
        changeDir: 246,
        changeMoveDir: 364,
        doHit: 268,
        autoAttack: 356,
        selectItem: 115,
        chatMessage: 563,
        upgradeItem: 852,
        createClan: 233,
        removeClan: 245,
        kickClanMember: 235,
        clanRequest: 236,
        clanRequestResolve: 237,
        clanRequestReject: 238,
        equipHat: 131,
        pingEvent: 538,
    },
    banText: "breh..."
}