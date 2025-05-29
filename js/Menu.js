class Menu extends Snake {

  constructor(config) {
    super({
      key: `menu`
    });
  }

  create() {
    this.SNAKE_TICK = 0.03;

    this.SNAKE_TITLE_Y = 2;

    this.SNAKE_MENU_Y = 6;

    this.SNAKE_START_X = 0;
    this.SNAKE_START_Y = this.SNAKE_MENU_Y + (this.selected ? this.selected : 0);

    super.create();

    this.delisted = localStorage.getItem("snakists-delisted") === "true";

    this.title = this.strings.title;

    this.games = [];
    let index = 0;
    for (let game of this.strings.ui.games) {
      this.games.push({
        index: index,
        title: game.toUpperCase(),
        name: game
      });
      index++;
      this.strings[game].definition.word = game;
    };

    // Trying to get it to remember the menu position
    if (!(this.selected >= 0)) {
      this.selected = 0;
    }

    this.menuButtons = this.add.group();
    this.menuText = this.add.group();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.createMenu();

    this.setScoreText("");
    this.snakeBitsToAdd = 20;

    this.transition = false;
  }

  tick() {
    this.addSnakeBits();
    this.updateSnakePosition();
  }

  handleKeyboardInput() {
    if (this.transition) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.up();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.down();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.right();
    }
  }

  /**
   * Create stuff
   */

  createMenu() {
    const titleX = 2;
    const titleY = this.SNAKE_TITLE_Y;

    this.addTextToGrid(titleX, titleY, this.title);

    const menuTop = this.SNAKE_MENU_Y;
    let x = 2;
    let y = menuTop;

    for (let game of this.games) {
      this.addTextToGrid(x, y, [game.title.toUpperCase()], this.menuText)//, this.menuButtons, this.menuItemTouched);
      y++;
    }

    const menuBottom = menuTop + this.games.length - 1;

    this.addTextToGrid(x, menuBottom + 2, ["PIPPINBARR.COM"], this.menuText)//, this.menuButtons, this.menuItemTouched);


    let instructions = "OH NO."
    if (this.sys.game.device.os.desktop) {
      instructions = this.strings.menu.instructions.keyboard;
    }
    else {
      instructions = this.strings.menu.instructions.touch;
    }
    this.addTextToGrid(x, this.NUM_ROWS - 3, instructions);
  }

  createControls() {

  }

  createWalls() {
    this.wallGroup = this.physics.add.group();
  }

  up() {
    if (this.selected === 0) {
      this.selected = this.games.length + 1;
      this.snakeHead.y = (this.SNAKE_MENU_Y + this.games.length + 1) * this.GRID_SIZE;
      this.moveSFX.play();
    }
    else if (this.selected > 0) {
      this.selected--;
      this.snakeHead.y -= this.GRID_SIZE;
      if (this.selected === this.games.length) {
        this.selected--;
        this.snakeHead.y -= this.GRID_SIZE;
      }

      this.moveSFX.play();
    }
  }

  down() {
    if (this.selected === this.games.length + 1) {
      this.selected = 0;
      this.snakeHead.y = this.SNAKE_MENU_Y * this.GRID_SIZE;
      this.moveSFX.play();
    }
    else if (this.selected < this.games.length) {
      this.selected++;

      this.snakeHead.y += this.GRID_SIZE;
      if (this.selected === this.games.length) {
        this.selected++;
        this.snakeHead.y += this.GRID_SIZE;
      }

      this.moveSFX.play();
    }
  }

  left() {

  }

  right() {
    let callback = () => {
      this.scene.start("walloftext", this.games[this.selected]);
    }

    if (this.selected === this.games.length + 1) {
      callback = () => {
        window.open("https://pippinbarr.com", "_blank");
        this.next = new Phaser.Geom.Point(0, 0);
        this.snakeHead.x = 0;
        this.transition = false;
        this.moveSFX.setVolume(1);
      }
    }
    this.next = new Phaser.Geom.Point(this.GRID_SIZE, 0);
    this.transition = true;
    this.appleSFX.play();
    // For some reason it plays a single moveSFX at the end of the scene??
    this.moveSFX.setVolume(0);
    this.time.addEvent({
      delay: 1500,
      callback: callback
    })
  }
}