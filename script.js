document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener("keydown", function(e) {

        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {

            e.preventDefault();

        }

    }, false);

    const grid = document.querySelector('.grid')

    let squares = Array.from(document.querySelectorAll(".grid div"))

    const scoreDisplay = document.querySelector('#score')

    const startButton = document.querySelector('#start-button')

    const lineCountDisplay = document.querySelector('#linesCount')

    const timePlayed = document.querySelector('#timePlayed')

    const tetrisesDisplay = document.querySelector('#tetrisesDisplay')

    const width = 10

    let howManyLinesWasThat = 0

    let nextRandom = 0

    let moveDownTime

    let score = 0

    let lines = 0

    let seconds = 0

    let tetrisCount = 0

    const musicButton = document.querySelector('#music_button')

    const audio_theme = document.getElementById('theme_song')

    const audio_hold = document.getElementById('hold_sound')

    const audio_drop = document.getElementById('drop_sound')

    const audio_soft_drop = document.getElementById('soft_drop_sound')

    const audio_rotate = document.getElementById('rotate_sound')

    const audio_move = document.getElementById('move_sound')

    const audio_single = document.getElementById('single_sound')

    const audio_double = document.getElementById('double_sound')

    const audio_triple = document.getElementById('triple_sound')

    const audio_tetris = document.getElementById('tetris_sound')

 

   musicButton.addEventListener('click', () => {

        if (audio_theme.paused) {

            audio_theme.volume = .2

            audio_theme.play()

            document.getElementById('music_button_icon').src="music_icon.png"

        } else {

            audio_theme.pause()

            document.getElementById('music_button_icon').src="music_off_icon.png"

        }

    })

 

    let colors = [

        'dark_blue_tile',

        'red_tile',

        'purple_tile',

        'yellow_tile',

        'light_blue_tile',

        'orange_tile',

        'light_green_tile'

    ]

   

    //Piece Orientation Creations

    const lNormalPiece = [

        [1, width+1, width*2+1, 2],

        [width, width+1, width+2, width*2+2],

        [1, width+1, width*2+1, width*2],

        [width, width*2, width*2+1, width*2+2]

    ]

    const zNormalPiece = [

        [0, width, width+1, width*2+1],

        [width+1, width+2, width*2, width*2+1],

        [0, width, width+1, width*2+1],

        [width+1, width+2, width*2, width*2+1]

    ]

    const tPiece = [

        [1, width, width+1, width+2],

        [1, width+1, width+2, width*2+1],

        [width, width+1, width+2, width*2+1],

        [1, width, width+1, width*2+1]

    ]

    const oPiece = [

        [0, 1, width, width+1],

        [0, 1, width, width+1],

        [0, 1, width, width+1],

        [0, 1, width, width+1]

    ]

    const iPiece = [

        [1, width+1, width*2+1, width*3+1],

        [width, width+1, width+2, width+3],

        [1, width+1, width*2+1, width*3+1],

        [width, width+1, width+2, width+3]

    ]

    const lInversePiece = [

        [0, 1, width+1, width*2+1],

        [width, width+1, width+2, 2],

        [1, width+1, width*2+1, width*2+2],

        [width*3, width*2, width*2+1, width*2+2]

    ]

    const zInversePiece = [

        [1, width, width+1, width*2],

        [width, width+1, width*2+1, width*2+2],

        [1, width, width+1, width*2],

        [width, width+1, width*2+1, width*2+2]

    ]

    let thePieces = [lNormalPiece, zNormalPiece, tPiece, oPiece, iPiece, lInversePiece, zInversePiece]

 

    let currentPosition = 4

    let currentRotation = 0

 

    let random = Math.floor(Math.random()*thePieces.length)

    let current = thePieces[random][currentRotation]

    let heldPiece = ''

   

 

    function draw() {

        current.forEach(index => {

            squares[currentPosition + index].classList.add('piece')

            squares[currentPosition + index].classList.add(colors[random])

        })

    }

 

    function undraw() {

        current.forEach(index => {

            squares[currentPosition + index].classList.remove('piece')

            squares[currentPosition + index].classList.remove(colors[random])

        })

    }

 

    function control(e) {

        if(e.keyCode === 37) {

           moveLeft()

        } else if (e.keyCode === 32) {

            snapDown()

        } else if (e.keyCode === 39) {

            moveRight()

        } else if (e.keyCode === 40) {

            moveDown()

        } else if (e.keyCode === 38) {

            rotate()

        } else if (e.keyCode === 16) {

            holdPiece()

        }

    }

    document.addEventListener('keyup', control)

 

    function moveDown() {

        if (!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {

            undraw()

            currentPosition += width

            draw()

        } else {

            freeze()

        }

    }

 

    function freeze() {

        audio_soft_drop.volume = .2

        audio_soft_drop.play()

        current.forEach(index => squares[currentPosition + index].classList.add('taken'))

       

        random = nextRandom

        nextRandom = Math.floor(Math.random() * thePieces.length)

        addScore()

        current = thePieces[random][currentRotation]

        currentPosition = 4

        draw()

        gameOver()

        displayNextPiece()

}

 

    function snapDown() {

        audio_drop.volume = .2

        audio_drop.play()

        let snapGoal = 200-currentPosition

        let snapIncrement = 10

       while (snapIncrement<snapGoal && currentPosition > 4) {  

        moveDown()

        snapIncrement+=10

        }

    }

 

    function moveLeft() {

        if (audio_move.play) {

            audio_move.currentTime = 0

            audio_move.volume = .2

            audio_move.play()

        } else if (audio_move.paused) {

            audio_move.volume = .2

            audio_move.play()

        }

        undraw()

        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

 

        if(!isAtLeftEdge) {

            currentPosition -=1

        }

 

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {

            currentPosition +=1

        }

        draw()

    }

 

    function moveRight() {

        if (audio_move.play) {

            audio_move.currentTime = 0

            audio_move.volume = .2

            audio_move.play()

        } else if (audio_move.paused) {

            audio_move.volume = .2

            audio_move.play()

        }

        undraw()

        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

 

        if(!isAtRightEdge) {

            currentPosition +=1

        }

 

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {

            currentPosition -=1

        }

 

        draw()

    }

 

    function rotate() {

        if (audio_rotate.play) {

            audio_rotate.currentTime = 0

            audio_rotate.volume = .2

            audio_rotate.play()

        } else if (audio_rotate.paused) {

            audio_rotate.volume = .2

            audio_rotate.play()

        }

       

        undraw()

        //if statements to make sure rotations dont clip pieces across board limits

        //fix L piece

        if (random === 0) {

            if (currentRotation === 0 && (currentPosition%10 === 9)) {

                currentPosition +=1

            }

            if (currentRotation === 2 && (currentPosition%10 === 8)) {

                currentPosition -=1

            }

        }

        //fix Z piece

        if (random === 1) {

            if ((currentRotation === 0 || currentRotation === 2) && (currentPosition%10 === 8)){

                currentPosition -=1

            }

        }

        //fix T piece

        if (random === 2) {

            if(currentRotation === 1 && currentPosition%10 === 9){

                currentPosition +=1

            }

            if(currentRotation === 3 && currentPosition%10 === 8){

                currentPosition -=1

            }

        }

        //fix I piece

        if (random === 4) {

            if ((currentRotation === 0 || currentRotation === 2) && currentPosition%10 === 9){

                currentPosition +=1

            }

            if ((currentRotation === 0 || currentRotation === 2) && currentPosition%10 === 8){

                currentPosition -=2

            }

        }

        //fix L inverse piece

        if (random === 5){

            if (currentRotation === 0 && currentPosition%10 === 8){

                currentPosition -= 1

            }

            if (currentRotation === 2 && currentPosition%10 === 9){

                currentPosition += 1

            }

        }

        // fix z inverse piece

        if (random === 6){

            if ((currentRotation === 0 || currentRotation === 2) && currentPosition%10 === 8){

                currentPosition -= 1

            }

        }

        currentRotation ++

        if(currentRotation === current.length) {

            currentRotation = 0

        }

        current = thePieces[random][currentRotation]

        draw()

    }

 

function displayNextPiece() {

 

    if (nextRandom === 0) {

        document.getElementById('up-next-piece-image').src="l-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('l-piece')

    } else if (nextRandom === 1) {

        document.getElementById('up-next-piece-image').src="z-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('z-piece')

    } else if (nextRandom === 2) {

        document.getElementById('up-next-piece-image').src="t-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('t-piece')

    } else if (nextRandom === 3) {

        document.getElementById('up-next-piece-image').src="o-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('o-piece')

    } else if (nextRandom === 4) {

        document.getElementById('up-next-piece-image').src="i-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('i-piece')

    } else if (nextRandom === 5) {

        document.getElementById('up-next-piece-image').src="l-inverse-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('l-inverse-piece')

    } else if (nextRandom === 6) {

        document.getElementById('up-next-piece-image').src="z-inverse-piece.png"

        document.getElementById('up-next-piece-image').className=""

        document.getElementById('up-next-piece-image').classList.add('z-inverse-piece')

    }

   

}

 

// add button

startButton.addEventListener('click', () => {

    if (moveDownTime) {

        clearInterval(moveDownTime)

        moveDownTime = null

    } else {

        draw()

        moveDownTime = setInterval(function() {

            moveDown()

            countingTime()

        }, 1000)

        nextRandom = Math.floor(Math.random()*thePieces.length)

        displayNextPiece()

    }

})

 

function addScore() {

    for (let i = 0; i < 199; i += width) {

        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

 

        if(row.every(index => squares[index].classList.contains('taken'))) {

            howManyLinesWasThat += 1

            lines += 1

            lineCountDisplay.innerHTML = lines

            row.forEach(index => {

                squares[index].classList.remove('taken')

                squares[index].classList.remove('dark_blue_tile', 'red_tile', 'purple_tile', 'yellow_tile', 'light_blue_tile', 'orange_tile', 'orange_tile', 'light_green_tile', 'orange_tile')

            })

            const squaresRemoved = squares.splice(i, width)

            squares = squaresRemoved.concat(squares)

            squares.forEach(cell => grid.appendChild(cell))

        }

    }

    if (howManyLinesWasThat === 1) {

        score += 100

        scoreDisplay.innerHTML = score

        audio_single.volume = .2

        audio_single.play()

        howManyLinesWasThat = 0

    } else if (howManyLinesWasThat === 2) {

        score += 300

        scoreDisplay.innerHTML = score

        audio_double.volume = .2

        audio_double.play()

        howManyLinesWasThat = 0

    } else if (howManyLinesWasThat === 3) {

        score += 500

        scoreDisplay.innerHTML = score

        audio_triple.volume = .2

        audio_triple.play()

        howManyLinesWasThat = 0

    } else if (howManyLinesWasThat === 4) {

        score += 800

        scoreDisplay.innerHTML = score

        tetrisCount += 1

        tetrisesDisplay.innerHTML = tetrisCount

        audio_tetris.volume = .2

        audio_tetris.play()

        howManyLinesWasThat = 0

    }

}

function gameOver() {

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {

        clearInterval(moveDownTime)

        window.alert('Oof, game over. You scored ' + score + ' points and you cleared ' + lines + ' lines.')

    }

}

 

function holdPiece() {

    audio_hold.volume = .2

    audio_hold.play()

//is the current piece a blue l piece?

    if ((current === thePieces[0][0]) || (current === thePieces[0][1]) || (current === thePieces[0][2]) || (current === thePieces[0][3])) {

        document.getElementById('hold-piece-image').src="l-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('l-piece')

        //theres no piece in the hold area

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding blue piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //a blue piece is already in the hold space, nothing needs done

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('you just tried to hold another blue piece??')

            heldPiece = current

        //a red piece is in the hold space, blue needs put in and red needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('red piece to blue piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //a purple piece is in the hold space, blue needs put in and red needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('purple piece to blue piece')

            heldPiece = current

            undraw()

            random = 2

            current = thePieces[random][0]

            draw()

        //a yellow piece is in the hold space, blue needs put in and red needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('yellow piece to blue piece')

            heldPiece = current

            undraw()

            random = 3

            current = thePieces[random][0]

            draw()

        //a light blue piece is in the hold space, blue needs put in and light blue needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('light blue piece to blue piece')

            heldPiece = current

            undraw()

            random = 4

            current = thePieces[random][0]

            draw()

        //an orange piece is in the hold space, blue needs put in and orange needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('orange piece to blue piece')

            heldPiece = current

            undraw()

            random = 5

            current = thePieces[random][0]

            draw()

        //a green piece is in the hold space, blue needs put in and green needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('green piece to blue piece')

            heldPiece = current

            undraw()

            random = 6

            current = thePieces[random][0]

            draw()

        }

//is the current piece a red z piece?

    } else if ((current === thePieces[1][0]) || (current === thePieces[1][1]) || (current === thePieces[1][2]) || (current === thePieces[1][3])) {

        document.getElementById('hold-piece-image').src="z-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('z-piece')

        //there is no piece in the hold area

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding red piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //a blue piece is in the hold area, red needs put in and blue needs pulled out and applied to the current piece

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('blue piece to red piece')

            heldPiece = current

            undraw()

            random = 0

            current = thePieces[random][0]

            draw()

        //red piece is already in hold area so nothing needs done

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('you just tried to hold another red piece???')

            heldPiece = current

        //purple piece is in hold area, red goes into hold and purple comes out onto the board

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('purple piece to red piece')

            heldPiece = current

            undraw()

            random = 2

            current = thePieces[random][0]

            draw()

        //yellow piece is in hold, red goes into hold and yellow comes out onto board

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('yellow piece to to red piece')

            heldPiece = current

            undraw()

            random = 3

            current = thePieces[random][0]

            draw()

        //light blue is in hold, red goes into hold and light blue come out onto board

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('light blue piece to red piece')

            heldPiece = current

            undraw()

            random = 4

            current = thePieces[random][0]

            draw()

        //orange is in hold, red goes into hold and orange comes out onto board

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('orange piece to red piece')

            heldPiece = current

            undraw()

            random = 5

            current = thePieces[random][0]

            draw()

        //green piece in hold, red goes into hold and green comes out onto board

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('green piece to red piece')

            heldPiece = current

            undraw()

            random = 6

            current = thePieces[random][0]

            draw()

        }

//is the current piece a purple t piece?

    } else if ((current === thePieces[2][0]) || (current === thePieces[2][1]) || (current === thePieces[2][2]) || (current === thePieces[2][3])) {

        document.getElementById('hold-piece-image').src="t-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('t-piece')

        //no piece in hold

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding purple piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //blue piece is in hold, purple piece goes into hold and blue pieces come onto board

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('blue piece to purple piece')

            heldPiece = current

            undraw()

            random = 0

            current = thePieces[random][0]

            draw()

        //red piece in hold, purple piece goes in and red piece comes out onto board

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('red piece to purple piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //purple piece is alrady in hold nothing needs done

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('you just tried to hold another purple piece???')

            heldPiece = current

        //yellow in hold, purple piece goes into hold and yellow comes out onto board

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('yellow piece to purple piece')

            heldPiece = current

            undraw()

            random = 3

            current = thePieces[random][0]

            draw()

        //light blue in hold, purple goes into hold and light blue comes out onto board

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('light blue piece to purple piece')

            heldPiece = current

            undraw()

            random = 4

            current = thePieces[random][0]

            draw()

        //orange in hold, purple goes into hold and orange come onto board

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('orange piece to purple piecee')

            heldPiece = current

            undraw()

            random = 5

            current = thePieces[random][0]

            draw()

        //green in hold, purple into hold and green onto board

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('green piece to purple piece')

            heldPiece = current

            undraw()

            random = 6

            current = thePieces[random][0]

            draw()

        }

//is the current piece a yellow o piece?

    } else if ((current === thePieces[3][0]) || (current === thePieces[3][1]) || (current === thePieces[3][2]) || (current === thePieces[3][3])) {

        document.getElementById('hold-piece-image').src="o-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('o-piece')

        //hold is empty

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding yellow piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //blue in hold, yellow into hold and blue onto board

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('blue piece to yellow piece')

            heldPiece = current

            undraw()

            random = 0

            current = thePieces[random][0]

            draw()

        //red in hold, yellow into hold and red onto board

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('red piece to yellow piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //purple in hold, yellow into hold and purple onto board

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('purple piece to yellow piece')

            heldPiece = current

            undraw()

            random = 2

            current = thePieces[random][0]

            draw()

        //yellow already in hold nothing needs done

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('you just tried to hold another yellow piece??')

            heldPiece = current

        //light blue in hold, yellow into hold and light blue onto board

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('light blue piece to yellow piece')

            heldPiece = current

            undraw()

            random = 4

            current = thePieces[random][0]

            draw()

        //orange in hold, yellow into hold and orange onto board

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('orange piece to yellow piece')

            heldPiece = current

            undraw()

            random = 5

            current = thePieces[random][0]

            draw()

        //green in hold, yellow into hold and green onto board

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('green piece to yellow piece')

            heldPiece = current

            undraw()

            random = 6

            current = thePieces[random][0]

            draw()

        }

//is the current piece a light blue i piece?

    }else if ((current === thePieces[4][0]) || (current === thePieces[4][1]) || (current === thePieces[4][2]) || (current === thePieces[4][3])) {

        document.getElementById('hold-piece-image').src="i-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('i-piece')

        //hold is empty

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding light blue piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //blue in hold, light blue into hold and blue onto board

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('blue piece to light blue piece')

            heldPiece = current

            undraw()

            random = 0

            current = thePieces[random][0]

            draw()

        //red in hold, light blue into hold and red onto board

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('red piece to light blue piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //purple in hold, light blue into hold and purple onto board

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('purple piece to light blue piece')

            heldPiece = current

            undraw()

            random = 2

            current = thePieces[random][0]

            draw()

        //yellow in hold, light blue into hold and yellow onto board

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('yellow to light blue piece')

            heldPiece = current

            undraw()

            random = 3

            current = thePieces[random][0]

            draw()

        //light blue piece is already in hold and nothing else needs done

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('you just tried to hold another light blue piece??')

            heldPiece = current

        //orange in hold, light blue into hold and orange onto board

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('orange piece to light blue piece')

            heldPiece = current

            undraw()

            random = 5

            current = thePieces[random][0]

            draw()

        //green in hold, light blue into hold and green onto board

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('green piece to light blue piece')

            heldPiece = current

            undraw()

            random = 6

            current = thePieces[random][0]

            draw()

        }

//is the current piece an orange l inverse piece?

    }else if ((current === thePieces[5][0]) || (current === thePieces[5][1]) || (current === thePieces[5][2]) || (current === thePieces[5][3])) {

        document.getElementById('hold-piece-image').src="l-inverse-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('l-inverse-piece')

        //hold is empty

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding orange piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //blue in hold, orange into hold and blue onto board

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('blue piece to orange piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //red in hold, orange into hold and red onto board

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('red piece to orange piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //purple in hold, orange into hold and purple onto board

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('purple piece to orange piece')

            heldPiece = current

            undraw()

            random = 2

            current = thePieces[random][0]

            draw()

        //yellow in hold, orange into hold and yellow onto board

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('yellow to orange piece')

            heldPiece = current

            undraw()

            random = 3

            current = thePieces[random][0]

            draw()

        //light blue in hold, orange into hold and light blue onto board

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('light blue to orange piece')

            heldPiece = current

            undraw()

            random = 4

            current = thePieces[random][0]

            draw()

        //orange piece already in hold and nothing else needs done

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('another orange piece?!')

            heldPiece = current

        //green in hold, orange into hold and green onto board

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('green piece to orange piece')

            heldPiece = current

            undraw()

            random = 6

            current = thePieces[random][0]

            draw()

        }

//is the current piece a green z inverse piece?

    }else if ((current === thePieces[6][0]) || (current === thePieces[6][1]) || (current === thePieces[6][2]) || (current === thePieces[6][3])) {

        document.getElementById('hold-piece-image').src="z-inverse-piece.png"

        document.getElementById('hold-piece-image').className=""

        document.getElementById('hold-piece-image').classList.add('z-inverse-piece')

        //hold is empty

        if (heldPiece === '') {

            heldPiece = current

            console.log('holding green piece')

            undraw()

            random = nextRandom

            nextRandom = Math.floor(Math.random() * thePieces.length)

            current = thePieces[random][currentRotation]

            displayNextPiece()

            draw()

        //blue in hold, green into hold and blue onto board

        } else if ((heldPiece === thePieces[0][0]) || (heldPiece === thePieces[0][1]) || (heldPiece === thePieces[0][2]) || (heldPiece === thePieces[0][3])) {

            console.log('blue piece to green piece')

            heldPiece = current

            undraw()

            random = 0

            current = thePieces[random][0]

            draw()

        //red in hold, green into hold and red onto board

        } else if ((heldPiece === thePieces[1][0]) || (heldPiece === thePieces[1][1]) || (heldPiece === thePieces[1][2]) || (heldPiece === thePieces[1][3])) {

            console.log('red piece to green piece')

            heldPiece = current

            undraw()

            random = 1

            current = thePieces[random][0]

            draw()

        //purple in hold, green into hold and purple onto board

        } else if ((heldPiece === thePieces[2][0]) || (heldPiece === thePieces[2][1]) || (heldPiece === thePieces[2][2]) || (heldPiece === thePieces[2][3])) {

            console.log('purple piece to green piece')

            heldPiece = current

            undraw()

            random = 2

            current = thePieces[random][0]

            draw()

        //yellow in hold, green into hold and yellow onto board

        } else if ((heldPiece === thePieces[3][0]) || (heldPiece === thePieces[3][1]) || (heldPiece === thePieces[3][2]) || (heldPiece === thePieces[3][3])) {

            console.log('yellow to to green piece')

            heldPiece = current

            undraw()

            random = 3

            current = thePieces[random][0]

            draw()

        //light blue in hold, green into hold and light blue onto board

        } else if ((heldPiece === thePieces[4][0]) || (heldPiece === thePieces[4][1]) || (heldPiece === thePieces[4][2]) || (heldPiece === thePieces[4][3])) {

            console.log('light blue to green piece')

            heldPiece = current

            undraw()

            random = 4

            current = thePieces[random][0]

            draw()

        //orange in hold, green into hold and orange onto board

        } else if ((heldPiece === thePieces[5][0]) || (heldPiece === thePieces[5][1]) || (heldPiece === thePieces[5][2]) || (heldPiece === thePieces[5][3])) {

            console.log('orange to green piece')

            heldPiece = current

            undraw()

            random = 5

            current = thePieces[random][0]

            draw()

        //green in hold arleady nothing else needs done

        } else if ((heldPiece === thePieces[6][0]) || (heldPiece === thePieces[6][1]) || (heldPiece === thePieces[6][2]) || (heldPiece === thePieces[6][3])) {

            console.log('another green piecE????')

            heldPiece = current

        }

       

       

       

    }

}

 

function countingTime() {

    seconds += 1

    timePlayed.innerHTML = seconds

}

















})