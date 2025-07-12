

import items from "./game_configs/items.js"
import weapons from "./game_configs/weapons.js"

class Upgrades {
    constructor() {
        if (Upgrades.instance) {
            return Upgrades.instance
        }

        this.list = {}

        // Level 2:
        this.add(2, items[8]) // windmill

        // Level 3:
        this.add(3, items[1]) // blueberry
        this.add(3, items[3]) // wall tier 2

        // Level 4:
        this.add(4, weapons[1]) // great axe
        this.add(4, weapons[2]) // sword
        this.add(4, weapons[3]) // spear

        // Level 5:
        this.add(5, items[10]) // trap
        this.add(5, items[11]) // boost pad

        // Level 6:
        this.add(6, items[6]) // spike tier 2

        // Level 8:
        this.add(8, items[4]) // wall tier 3
        this.add(8, items[7]) // spike tier 3
        this.add(8, items[9]) // windmill tier 2

        Upgrades.instance = this
    }

    add(level, setting) {
        if (!this.list[level]) {
            this.list[level] = []
        }

        let upgrade = [setting.id, setting.isWeapon || false]

        if (typeof setting.parentID !== 'undefined') {
            upgrade.push(setting.parentID)
        }

        this.list[level].push(upgrade)
    }
}

export default Upgrades