// Enemies our player must avoid
const Enemy = function (x, y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.speed = 100 + Math.floor(Math.random() * 500);
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;
  // make enemy moves in loop
  if (this.x > 705) {
    this.x = -95;
    //incrase enemy speed
    this.speed = this.speed = 100 + Math.floor(Math.random() * 800)
  }

  // collisions logic
  if(player.x < this.x + 50 && player.y < this.y + 60 && this.x < player.x + 50 && this.y < player.y + 60) {
    player.hearts.pop();
    player.lifes--

    // in case of loosing
    if (player.lifes === 0) {
      player.score = 0;
      buildMessages(`






      Game over!`);
    }
    player.x = 300;
    player.y = 460;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
const Player = function (x, y, score, lifes) {
  // load image
  this.sprite = 'images/char-boy.png';
  // this.rockBarrier = 'images/Rock.png';
  this.x = x;
  this.y = y;
  this.score = score;
  this.lifes = lifes;
  this.hearts = [
    'images/heart.png',
    'images/heart.png',
    'images/heart.png'
  ];
}

// This class requires a render() method
Player.prototype.render = function () {
  // draw the player
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

  // draw the score panel
  ctx.font = 'normal 1em san serif';
  ctx.fillStyle = '#315B7E';
  ctx.fillText(`SCORE:   ${this.score}`, 100, 30);

  // draw lives panel
  for(let i = 0; i < this.lifes; i++) {
    let heartXDestenation = (i * 25) + 535;
    ctx.drawImage(Resources.get(this.hearts[i]), heartXDestenation, 9, 20, 30);
  }
  ctx.fillText(`LIVES:`, 475, 30);

  // if(this.lifes !== 0 && this.score === 100) {
  //   ctx.drawImage(Resources.get(this.rockBarrier), 300, 230);
  // }

};

Player.prototype.getPlayerScore = function () {
  return this.score;
}

// This class requires an update() method
Player.prototype.update = function () {
  //preventing player from moving off screan
  // one step in x-axis = 100
  if (this.x > 600) {
    this.x = 600;
  }
  if (this.x < 0) {
    this.x = 0;
  }
  if (this.y > 467) {
    this.y = 467
  }

  // prevent player of step on the rock
  // if(this.x === 300 && this.y === 227 && this.score === 100) {
  //     this.y = 307;
  // };
};

// This class requires a handleInput() method.
// to make player moves using keyboard arrows
Player.prototype.handleInput = function (allowedKeys) {
  switch (allowedKeys) {
    case 'left':
    this.x -= 100;
    break;
    case 'right':
    this.x += 100;
    break;
    case 'up':
    this.y -= 80;
    break;
    case 'down':
    this.y += 80;
    break;
  }

  // handle the score after winning
  // one step in y-axis = 80
  if (this.y < 0) {
    // let the player shown in the water for half a sec
    this.y = -13;
    // increase the score by 10;
    this.score += 100;

    if(player.score === 300) {
      // display a congrats message telling the player that he/she won the game
      // and ask them if they want to play again
      buildMessages(`




        You did it!
        That was fun!`, fireworksAnimation);
    } else {
      // display a congrats message only to show the player that there are next level
      buildMessages(`




        You finshed this level
        Time to start a new level`, loaderAnimation);
    }
  }
};


// Now instantiate your objects.
let allEnemies = [];
// create an array for y-axis destination (dy)
const dy = [65, 145, 225, 305];
// Place all enemy objects in an array called allEnemies
dy.forEach(yDestination => {
  let enemy = new Enemy(-100, yDestination);
  allEnemies.push(enemy);
});

// Place the player object in a variable called player
const player = new Player(300, 467, 0, 3);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'left',
    87: 'up',
    68: 'right',
    83: 'down'
    }
  player.handleInput(allowedKeys[e.keyCode]);
});


// build the message shown in case of winning or losing
function buildMessages(innerText, animation) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('messageDiv');
  messageDiv.style.height = '650px';
  messageDiv.style.width = '750px';
  messageDiv.style.position = 'absolute';
  messageDiv.style.top = '55px';
  messageDiv.style.left = '360px';
  messageDiv.style.backgroundColor = '#000';
  messageDiv.style.fontSize = '2em';

  const Message = document.createElement('div');
  Message.style.width = '100%';
  // Message.style.height = '100%';
  Message.style.position = 'relative';
  Message.style.color = '#3498db';


  Message.innerText = innerText;

  // animation by https://jsfiddle.net/elin/7m3bL/
  document.body.appendChild(messageDiv);
  messageDiv.appendChild(Message);
  // call animation function in case of winning
  if (animation !== undefined) {
    if(player.score === 300) {
      let fireworksDiv = animation();
      Message.appendChild(fireworksDiv);
    } else {
      let loaderDiv = animation();
      Message.appendChild(loaderDiv);
    }
  }

  // remove the congrats message
  // then show the canvas again with a new level
  if(player.lifes !== 0 && player.score !== 300) {
    setTimeout(() => {
      document.body.removeChild(messageDiv);
      player.y = 467;
    }, 2000);

  } else if (player.score === 300 || player.lifes === 0) {
    // add play again button in case of loosing that will reset the game
    let buttn = createButton();
    messageDiv.appendChild(buttn);
    addbuttonListener(buttn);

    //let player go back to the beginning
    player.y = 467;
  }
}

// make animation function in case of winning
function loaderAnimation() {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  return loader;
}

// make animation function in case of winning
function fireworksAnimation() {
  const fireworks = document.createElement('div');
  const before = document.createElement('div');
  const after = document.createElement('div');

  fireworks.classList.add('pyro');
  fireworks.classList.add('before');
  fireworks.classList.add('after');

  fireworks.appendChild(before);
  fireworks.appendChild(after);
  return fireworks;
}

//ceate button to rest the game in case of winning or loosing
function createButton () {
  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.tabindex = -1;
  btn.setAttribute('autofocus', true);
  btn.innerText = 'Play Again';
  return btn;
}

//add event listener to the button
function addbuttonListener(btton) {
  btton.addEventListener('click', function() {
    let messageDiv = document.querySelector('.messageDiv');
    document.body.removeChild(messageDiv);
    player.score = 0;
    player.lifes = 3;
    player.hearts = [
      'images/heart.png',
      'images/heart.png',
      'images/heart.png'
    ]
  });
}



