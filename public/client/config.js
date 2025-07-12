export default {
    textFont: "Hammersmith One",
    map: {
        width: 10000,
        height: 10000,
        color: "#7bc059"
    },
    minimap: {
        width: 150,
        height: 150,
        pointScale: 3,
        pointColors: {
            0: "#ffffff", // ally,
            1: "#eacd10", // clan leader
            2: "#ba0d0d" // enemy
        }
    },
    maxNicknameLength: 15,
    maxChatLength: 40,
    maxClanNameLength: 8,
    clientSendRate: 9,
    serverUpdateRate: 10,
    hitReturnRatio: .25,
    hitAngle: Math.PI / 2,
    outlineWidth: 7,
    gatherWiggle: 10,
    chatRemoveTime: 3500,
    gatherPacrticlesSpeed: .048,
    player: {
        scale: 35,
        handScale: 14,
        maxHealth: 100,
        colors: ["#bf8f54", "#cbb091", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db", "#be5454", "#b700fa", "#3c66c9", "#f7cf45", "#cc862b", "#556877", "#658f3d"],
        outlineColor: "#474747",
        outlineWidth: 5.5,
        nickname: {
            size: 30,
            xOffset: 0,
            yOffset: -34,
            outlineWidth: 8,
            color: "#fff",
            outlineColor: "#474747"
        },
        clan: {
            size: 30,
            xOffset: 0,
            yOffset: -68,
            outlineWidth: 8,
            color: "#fff",
            outlineColor: "#474747",
            leaderIconScale: 35,
            leaderIconXOffset: -5,
            leaderIconYOffset: 3
        },
        healthbar: {
            width: 40,
            height: 16,
            padding: 4,
            xOffset: 0,
            yOffset: 34,
            allyColor: ["#7bc059", "#87da5d"],
            enemyColor: ["#c05959", "#d25656"],
            outlineColor: "#3d3f42",
            radius: 6
        },
        chat: {
            alphaTime: 400,
            maxMessages: 5,
            textSize: 26,
            width: 17,
            height: 36,
            margin: 5,
            xOffset: 0,
            yOffset: -70,
            color: "#fff",
            bgColor: "rgba(0, 0, 0, .2)"
        }
    },
    buildings: {
        healthbar: {
            width: 25,
            height: 16,
            padding: 4,
            xOffset: 0,
            yOffset: 10,
            allyColor: ["#7bc059", "#87da5d"],
            enemyColor: ["#c05959", "#d25656"],
            outlineColor: "#3d3f42",
            radius: 6,
            hideDelay: 1e3
        }
    },
    animals: {
        healthbar: {
            width: 54,
            height: 22,
            padding: 4,
            xOffset: 0,
            yOffset: 100,
            color: ["#c05959", "#d25656"],
            outlineColor: "#3d3f42",
            radius: 8
        }
    },
    grid: {
        difX: 18,
        difY: 18,
        width: 4,
        color: "#3d6827",
        alpha: .06
    },
    boundings: {
        color: "#3d6827",
        alpha: .09
    },
    animatedText: {
        outlineWidth: 8,
        colors: [ 
            "#ffffff", "#7bc059",
            "#c05959", "#59a6c0"
        ],
        outlineColor: "#474747"
    },
    protocol: {
        http: location.protocol.split(":")[0],
        get ws() {
            return `ws${this.http.slice(4)}`
        }
    },
    host: location.host,
    viewport: {
        resolution: [1920, 1080],
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        zoom: 1
    },
    layers: {
        camera: [1, 1],
        background: [1, 2],
        grid: [1, 3],
        particlesManager: [1, 4],
        objectsManagerBP: [1, 5], // Before PlayersManager
        playersManager: [2, 1],
        animalsManager: [2, 2],
        objectsManager: [3, 2],
        boundings: [4, 1],
        entitiesInfo: [4, 2],
        textManager: [4, 3],
        dayNight: [4, 4],
        minimap: [4, 5],
        notifications: [4, 6]
    }
}