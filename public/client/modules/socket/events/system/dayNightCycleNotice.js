import { dayNight } from "../../../../constants.js"

function dayNightCycleNotice(data) {
    const state = data[0]

    if (state) {
        return dayNight.showDayNotification()
    }

    dayNight.showNightNotification()
}

export default dayNightCycleNotice