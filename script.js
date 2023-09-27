const globalContainer = document.getElementById('global-container')
const leftCanvas = document.getElementById('left-canvas')
const rightCanvas = document.getElementById('right-canvas')
const main = document.querySelector('main')
let leftCanvasDimensions
let rightCanvasDimensions
let left
let right
const feet = {
    left: [],
    right: []
}

const resizeCanvas = () => {
    leftCanvas.width = main.offsetWidth * 0.4
    leftCanvas.height = main.offsetHeight * 0.25
    rightCanvas.width = main.offsetWidth * 0.4
    rightCanvas.height = main.offsetHeight * 0.25

    leftCanvasDimensions = leftCanvas.getBoundingClientRect()
    rightCanvasDimensions = rightCanvas.getBoundingClientRect()

    left = leftCanvas.getContext('2d')
    right = rightCanvas. getContext('2d')
}
resizeCanvas()

window.addEventListener('resize', resizeCanvas)

const createFoot = direction => {
    let x

    direction === 'left' ? x = leftCanvasDimensions.width * 0.15 : x = rightCanvasDimensions.width * 0.85

    feet[direction].push({
        x: x,
        alpha: 0
    })
}

const moveFeet = () => {
    if (feet['left'].length > 0) {
        for (let i = 0; i < feet['left'].length; i++) {
            if (feet['left'][i]['x'] >= leftCanvasDimensions.width * 0.85) {
                feet['left'].splice(i, 1)
            } else {
                feet['left'][i]['x'] += leftCanvasDimensions.width * 0.002
                feet['left'][i]['alpha'] += 0.005
            }
        }
    }

    if (feet['right'].length > 0) {
        for (let i = 0; i < feet['right'].length; i++) {
            if (feet['right'][i]['x'] <= rightCanvasDimensions.width * 0.15) {
                feet['right'].splice(i, 1)
            } else {
                feet['right'][i]['x'] -= rightCanvasDimensions.width * 0.002
                feet['right'][i]['alpha'] += 0.005
            }
        }
    }
}

const drawEndZone = (ctx, x, y, radius) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgb(54, 54, 54)'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.closePath()
}

const drawFoot = (ctx, x, y, radius, alpha) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(54, 54, 54, ${alpha})`
    ctx.fill()
    ctx.closePath()
}

const randomIntegerInclusive = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const clearCanvas = (canvas, x, y, width, height) => {
    canvas.clearRect(x, y, width, height)
}

let lowerLimit = 300
let upperLimit = 900
let leftCounter = randomIntegerInclusive(lowerLimit, upperLimit)
let rightCounter = randomIntegerInclusive(lowerLimit, upperLimit)
let clock = 0
let clockDirection = 1
const animateFeet = () => {
    //clears canvas before drawing
    clearCanvas(left, 0, 0, leftCanvasDimensions.width, leftCanvasDimensions.height)
    clearCanvas(right, 0, 0, rightCanvasDimensions.width, rightCanvasDimensions.height)

    //clock alternation
    //if the clock reaches upper threshold, start counting down
    //if the clock reaches lower threshold, start counting up
    if (clock === 0) {
        clockDirection = 1
    }

    if (clock === 30000) {
        clockDirection = -1
    }

    //clock number
    //multiply clock direction by 5 because the setInterval is set to execute every 5 seconds
    clock += (clockDirection * 5)

    //lower and upper limits for drawing feet
    //ebbs and flows in terms of activity every 30 seconds
    //build speed while counting up, lessen speed while counting down
    //as fast as 100ms:300ms, and as slow as 300ms:900ms every oscillation
    if (clockDirection === 1) {
        lowerLimit = 300 - Math.floor(clock / 150)
        upperLimit = 900 - Math.floor(clock / 50)
    } 
    
    if (clockDirection === -1 ) {
        lowerLimit = 100 + Math.floor(Math.abs(30000 - clock) / 150)
        upperLimit = 300 + Math.floor(Math.abs(30000 - clock) / 50)
    }

    //drawing the end zones each frame
    drawEndZone(left, leftCanvasDimensions.width * 0.85, leftCanvasDimensions.height * 0.5, leftCanvasDimensions.width * 0.1)
    drawEndZone(right, rightCanvasDimensions.width * 0.15, rightCanvasDimensions.height * 0.5, rightCanvasDimensions.width * 0.1)

    //internal counters
    //subtract one from counter each frame
    leftCounter--
    rightCounter--
    
    //internal counter logic
    //when the timer reaches its
    if (leftCounter <= 0) {
        createFoot('left')
        leftCounter = randomIntegerInclusive(lowerLimit, upperLimit)
    }

    if (rightCounter <= 0) {
        createFoot('right')
        rightCounter = randomIntegerInclusive(lowerLimit, upperLimit)
    }

    //increment each foot's position
    moveFeet()

    //draw each foot
    for (let i = 0; i < feet['left'].length; i++) {
        drawFoot(left, feet['left'][i]['x'], leftCanvasDimensions.height * 0.5, leftCanvasDimensions.width * 0.1, feet['left'][i]['alpha'])
    }

    for (let i = 0; i < feet['right'].length; i++) {
        drawFoot(right, feet['right'][i]['x'], rightCanvasDimensions.height * 0.5, rightCanvasDimensions.width * 0.1, feet['right'][i]['alpha'])
    }
}

let globalClock = 0
const animateClock = () => {
    globalClock += 5
}

const endSequence = () => {
    document.body.style.animation = 'fade-out 3s ease-out both';
}
    
const startPiece = () => {
    start.style.animation = 'fade-out 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both'
    const interval = setInterval(() => {
        if (globalClock >= 300000) {
            clearInterval(interval)
            location.reload()
        } else if (globalClock === 295000) {
            endSequence()
        }
        animateFeet()
        animateClock()
    }, 5)
}


