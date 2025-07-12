class BreathAnimation {
    constructor({
        scaleRatio,
        reductionWhenRunning,
        entity,
        speeds
    }) {
        this.scaleRatio = scaleRatio
        this.reductionWhenRunning = reductionWhenRunning
        this.entity = entity
        this.speeds = speeds

        this.cycleState = 1
        this._cycleTick = 0
    }

    get maxCycleSpeed() {
        return this.reductionWhenRunning && this.entity.speed >= 5 ? this.speeds.max - 1 : this.speeds.max
    }

    get minCycleSpeed() {
        return this.reductionWhenRunning && this.entity.speed >= 5 ? this.speeds.min - 21 : this.speeds.min
    }

    get cycleTick() {
        return Math.max(Math.min(this._cycleTick, this.maxCycleSpeed), this.minCycleSpeed)
    }

    set cycleTick(value) {
        this._cycleTick = value
    }

    get breathScale() {
        return this.cycleTick / this.scaleRatio
    }

    update(delta) {
        if (this.cycleState === 1) {
            if (this.cycleTick >= this.maxCycleSpeed) {
                this.cycleState = -1
            }
        } else {
            if (this.cycleTick <= this.minCycleSpeed) {
                this.cycleState = 1
            }
        }

        this.cycleTick += Math.abs(delta) * this.cycleState
    }
}

export default BreathAnimation