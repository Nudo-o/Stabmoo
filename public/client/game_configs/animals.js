class Animal {
    constructor({
        id,
        name,
        width,
        height,
        health,
        scale,
        reverseSpriteAnim,
        spriteFrameSpeed,
        model
    }) {
        this.id = id
        this.name = name
        this.width = width
        this.height = height
        this.health = health
        this.scale = scale
        this.reverseSpriteAnim = reverseSpriteAnim
        this.spriteFrameSpeed = spriteFrameSpeed
        this.model = model
        
        this.isAnimal = true
    }
}

export default [
    new Animal({
        id: 0,
        name: "Cow",
        health: 400,
        width: 195,
        height: 220,
        scale: 75,
        spriteFrameSpeed: 75,
        model: {
            head: ["cow/head/cow_head_passive", "cow/head/cow_head_scared"],
            body: ["cow/cow_body"],
            tail: [
                "cow/tail/cow_tail_1", "cow/tail/cow_tail_2",
                "cow/tail/cow_tail_3", "cow/tail/cow_tail_4",
                "cow/tail/cow_tail_5", "cow/tail/cow_tail_6",
                "cow/tail/cow_tail_7", "cow/tail/cow_tail_8",
            ]
        }
    }),
    new Animal({
        id: 1,
        name: "Wolf",
        health: 950,
        width: 195,
        height: 220,
        scale: 75,
        model: {
            head: [
                "wolf/head/wolf_head_passive", "wolf/head/wolf_head_aggresive",
                "wolf/head/wolf_head_bite"
            ],
            body: ["wolf/wolf_body"],
            tail: ["wolf/wolf_tail"]
        }
    })
]