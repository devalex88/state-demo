const googleModel = require('./google')

function findFullPathsFromPlan(fullPaths, plan) {
    plan.paths.forEach(path => {
        let fullPath = '';
        const { state, segments } = path
        segments.forEach(segment => {
            const { state, event } = segment
            const { value: stateName } = state
            const { type: eventName } = event
            if (eventName === 'xstate.init') {
                fullPath += ': ' +  stateName
            } else {
                fullPath += stateName + ' - ' + eventName + ' → '
            }
        })
        const { value: stateName } = state
        fullPath += stateName
        fullPaths.push(fullPath)
    })
    return fullPaths
}

function findFullPathsFromPlans(plans) {
    const fullPaths = []
    plans.forEach(plan => {
        findFullPathsFromPlan(fullPaths, plan)
    })
    return fullPaths
}

function findAllPaths() {
    return findFullPathsFromPlans(googleModel.getSimplePathPlans())
}

module.exports = findAllPaths