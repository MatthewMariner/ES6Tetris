/*
*
*	Variables
*
*/

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};


//Obj
var tetrisJS = {

        init: function() {
        	//Init listener functions
			this.playerReset();
			this.updateScore();
			this.update();
            this.bindUIActions();
        },


	    bindUIActions: function() {
	            // Console Logs For Test
	             document.addEventListener('keydown', this.listenerEvent);
	    },

		collide: function(arena, player) {

		    const m = player.matrix;
		    const o = player.pos;
		    for (let y = 0; y < m.length; ++y) {
		        for (let x = 0; x < m[y].length; ++x) {
		            if (m[y][x] !== 0 &&
		               (arena[y + o.y] &&
		                arena[y + o.y][x + o.x]) !== 0) {
		                return true;
		            }
		        }
		    }
		    return false;
		},

		createMatrix: function(w, h) {

		    const matrix = [];
		    while (h--) {
		        matrix.push(new Array(w).fill(0));
		    }
		    return matrix;

		},

	    listenerEvent: function() {
			let buttonPressed = event.keyCode;
		    if (buttonPressed === 37) {
		        tetrisJS.playerMove(-1);
		    } else if (buttonPressed === 39) {
		        tetrisJS.playerMove(1);
		    } else if (buttonPressed === 40) {
		        tetrisJS.playerDrop();
		    } else if (buttonPressed === 38) {
		    	alert('ress1');
		        tetrisJS.playerRotate(-1);
		    } else if (buttonPressed === 87) {
		        alert('ress2');
		        tetrisJS.playerRotate(1);
		    }
	    },

		draw: function() {
		    context.fillStyle = '#000';
		    context.fillRect(0, 0, canvas.width, canvas.height);
		    tetrisJS.drawMatrix(arena, {x: 0, y: 0});
		    tetrisJS.drawMatrix(player.matrix, player.pos);
		},


		 merge: function(arena, player) {
		    player.matrix.forEach((row, y) => {
		        row.forEach((value, x) => {
		            if (value !== 0) {
		                arena[y + player.pos.y][x + player.pos.x] = value;
		            }
		        });
		    });
		},

		rotate: function(matrix, dir) {
		    for (let y = 0; y < matrix.length; ++y) {
		        for (let x = 0; x < y; ++x) {
		            [
		                matrix[x][y],
		                matrix[y][x],
		            ] = [
		                matrix[y][x],
		                matrix[x][y],
		            ];
		        }
		    }

		    if (dir > 0) {
		        matrix.forEach(row => row.reverse());
		    } else {
		        matrix.reverse();
		    }
		},


		playerDrop: function() {
		    player.pos.y++;
		    if (tetrisJS.collide(arena, player)) {
		        player.pos.y--;
		        tetrisJS.merge(arena, player);
		        tetrisJS.playerReset();
		        tetrisJS.arenaSweep();
		        tetrisJS.updateScore();
		    }
		    dropCounter = 0;
		},

		playerMove: function(offset) {
		    player.pos.x += offset;
		    if (tetrisJS.collide(arena, player)) {
		        player.pos.x -= offset;
		    }
		},

		playerRotate: function(dir) {
		    const pos = player.pos.x;
		    let offset = 1;
		    tetrisJS.rotate(player.matrix, dir);
		    while (tetrisJS.collide(arena, player)) {
		        player.pos.x += offset;
		        offset = -(offset + (offset > 0 ? 1 : -1));
		        if (offset > player.matrix[0].length) {
		            tetrisJS.rotate(player.matrix, -dir);
		            player.pos.x = pos;
		            return;
		        }
		    }
		},


	

		update: function(time = 0) {
		    const deltaTime = time - lastTime;

		    dropCounter += deltaTime;
		    if (dropCounter > dropInterval) {
		        tetrisJS.playerDrop();
		    }

		    lastTime = time;

		    tetrisJS.draw();
		    requestAnimationFrame(tetrisJS.update);
		},

        arenaSweep: function() {
		    let rowCount = 1;
		    outer: for (let y = arena.length -1; y > 0; --y) {
		        for (let x = 0; x < arena[y].length; ++x) {
		            if (arena[y][x] === 0) {
		                continue outer;
		            }
		        }

		        const row = arena.splice(y, 1)[0].fill(0);
		        arena.unshift(row);
		        ++y;

		        player.score += rowCount * 10;
		        rowCount *= 2;
		    }
		},

		updateScore: function() {
			document.getElementById('score').innerText = player.score;
		},

		createPiece: function(type) {
		    if (type === 'I') {
		        return [
		            [0, 1, 0, 0],
		            [0, 1, 0, 0],
		            [0, 1, 0, 0],
		            [0, 1, 0, 0],
		        ];
		    } else if (type === 'L') {
		        return [
		            [0, 2, 0],
		            [0, 2, 0],
		            [0, 2, 2],
		        ];
		    } else if (type === 'J') {
		        return [
		            [0, 3, 0],
		            [0, 3, 0],
		            [3, 3, 0],
		        ];
		    } else if (type === 'O') {
		        return [
		            [4, 4],
		            [4, 4],
		        ];
		    } else if (type === 'Z') {
		        return [
		            [5, 5, 0],
		            [0, 5, 5],
		            [0, 0, 0],
		        ];
		    } else if (type === 'S') {
		        return [
		            [0, 6, 6],
		            [6, 6, 0],
		            [0, 0, 0],
		        ];
		    } else if (type === 'T') {
		        return [
		            [0, 7, 0],
		            [7, 7, 7],
		            [0, 0, 0],
		        ];
		    }
		},
		
		drawMatrix: function(matrix, offset) {
		    matrix.forEach((row, y) => {
		        row.forEach((value, x) => {
		            if (value !== 0) {
		                context.fillStyle = colors[value];
		                context.fillRect(x + offset.x,
		                                 y + offset.y,
		                                 1, 1);
		            }
		        });
		    });
		},

		playerReset: function() {
		    const pieces = 'TJLOSZI';
		    player.matrix = tetrisJS.createPiece(pieces[pieces.length * Math.random() | 0]);
		    player.pos.y = 0;
		    player.pos.x = (arena[0].length / 2 | 0) -
		                   (player.matrix[0].length / 2 | 0);
		    if (tetrisJS.collide(arena, player)) {
		        arena.forEach(row => row.fill(0));
		        player.score = 0;
		        tetrisJS.updateScore();
		    }
		}

}



const arena = tetrisJS.createMatrix(12, 20);

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(2, 2);

let dropCounter = 0,
	dropInterval = 1000,
	lastTime = 0;

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

tetrisJS.init();