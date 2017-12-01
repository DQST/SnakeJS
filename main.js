 function Main() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var play = true;
	var score = 0;

	var x = 0, 
		y = 0;
	var dx = 20,
		dy = 0;

	var level = 1;
	var body = [{x: 0, y: 0}];
	var eat_arr = [];

	var self = this;

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function getRandom(min, max, num) {
		return Math.floor(Math.floor(Math.random() * (max - min + 1) + min) / num) * num;
	}

	function drawEat() {
		eat_arr.forEach(function(e) {
			ctx.fillStyle = 'red';
			ctx.fillRect(e.x, e.y, 20, 20);
		});
	}

	function check(x, y) {
		var find = -1;
		eat_arr.forEach(function(e, i) {
			if (e.x === x && e.y === y) {
				find = i;
				return;
			}
		});
		return find;
	}

	function himSelfCheck(x, y) {
		var res = false;
		body.slice(1).forEach(function(e) {
			if (e.x === x && e.y === y) {
				res = true;
				return;
			}
		});
		return res;
	}

	function drawBody() {
		var h = body[0];
		var f = {x: h.x+dx, y: h.y+dy};
		body.splice(0, 0, f)
		body.splice(body.length - 1, 1);

		if (himSelfCheck(f.x, f.y)) {
			play = false;
		}

		body.forEach(function(e) {
			ctx.fillStyle = 'green';
			ctx.fillRect(e.x, e.y, 20, 20);

			if (e.x > canvas.width - 20) {
				e.x = 0;
			} else if (e.x < 0) {
				e.x = canvas.width - 20;
			}

			if (e.y > canvas.height - 20) {
				e.y = 0;
			} else if (e.y < 0) {
				e.y = canvas.height - 20;
			}

			var r = check(e.x , e.y);
			if (r > -1) {
				eat_arr.splice(r, 1);
				var last = body[body.length - 1];
				body.push(last);
				score += 5;
			}
		});
	}

	function drawText(text, size, color, align, x, y) {
		ctx.font = size + 'px Arial';
		ctx.fillStyle = color;
		ctx.textAlign = align;
		ctx.fillText(text, x | (canvas.width / 2), y | (canvas.height / 2));
	}

	this.spawnEat = function() {
		for (var i = 0; i < level; i++) {
			var x = getRandom(0, canvas.width, 20) , 
				y = getRandom(0, canvas.height, 20);
			eat_arr.push({
				x: x, 
				y: y
			});
		}
	}

	this.update = function() {
		if (eat_arr.length === 0) {
			level++;
			self.spawnEat();
		}

		clear();
		drawEat();
		var e = document.getElementById('score');
		e.innerHTML = 'Score: ' + score;
		if (play) {
			drawBody();
		} else {
			drawText('Game Over!', 30, 'white', 'center');
			drawText('Press R to restart', 12, 'white', 'center', 0, 60);
		}
	};

	document.addEventListener('keydown', function(event) {
		switch (event.keyCode) {
			// W
			case 87:
				dy = -20;
				dx = 0;
				break;
			// S
			case 83:
				dy = 20;
				dx = 0;
				break;
			// D
			case 68:
				dx = 20;
				dy = 0;
				break;
			// A
			case 65:
				dx = -20;
				dy = 0;
				break;
			// R
			case 82:
				if (play === false) {
					body = [{x: 0, y: 0}];
					eat_arr - [];
					play = true;
					score = 0;
					level = 1;
				}
				break;
			default:
				break;
		}
	});
}


window.onload = function() {
	var main = new Main();
	main.spawnEat();
	setInterval(main.update, 60);
}
