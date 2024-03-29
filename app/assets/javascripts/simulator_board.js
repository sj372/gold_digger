function Piece(type, dir, color) {
    var type = type;
    var dir = dir;
    var color = color;

    this.setType = function (type) {
        this.type = type;
    }
    this.getType = function () {
        return type;
    }

    this.setDir = function (dir) {
        this.dir = dir;
    }

    this.getDir = function () {
        return dir;
    }

    this.setColor = function (color) {
        this.color = color;
    }

    this.getColor = function () {
        return color;
    }
}

function Board(board_width, board_height, gold_total, mine_total, enemy_total) {

    var board;

    var dir_name = ["up", "down", "left", "right"];
    var dir_map = {
        up: [-1, 0],
        down: [1, 0],
        left: [0, -1],
        right: [0, 1]
    };

    var element_settings = {
        empty: {
            type: 'empty',
            color: 'Gainsboro'
        },
        bot: {
            type: "bot",
            color: 'green'
        },
        gold: {
            type: "gold",
            color: "yellow",
            value: 10
        },
        mine: {
            type: "mine",
            color: "red",
            damage: 5

        },
        enemy: {
            type: "enemy",
            color: "blue",
            damage: 10
        }
    };
    this.clone = function() {
        var new_board = new Board(board_width, board_height, gold_total, mine_total, enemy_total);
        new_board.setBoard(board.clone());
        return new_board;
    };

    this.getWidth = function() {
        return board_width;
    };

    this.getHeight = function() {
        return board_height;
    };

    this.getElementSettings = function() {
        return element_settings;
    };

    this.getRandCoord = function () {
        return [getRandNum(0, board_height - 1), getRandNum(0, board_width - 1)];
    };

    this.putElement = function (coord, piece) {
        board[coord[0]][coord[1]] = piece;
    };

    this.putElementRandom = function (elm_type) {
        var found = false;
        while (!found) {
            var coord = this.getRandCoord();
            if (board[coord[0]][coord[1]].getType() == element_settings.empty.type) {
                board[coord[0]][coord[1]] = new Piece(elm_type, this.getRandDir(), element_settings[elm_type].color);
                found = true;
            }
        }
    };

    // get random direction
    this.getRandDir = function () {
        return dir_name[getRandNum(0, dir_name.length - 1)];
    };

    this.emptyBoard = function () {
        for (var row = 0; row < board_height; row++) {
            for (var col = 0; col < board_width; col++) {
                board[row][col] = new Piece(element_settings.empty.type, "nowhere", element_settings.empty.color);
            }
        }
    };

    this.initBoard = function () {
        board = new Array(board_height);
        for (var i = 0; i < board_height; i++) {
            board[i] = new Array(board_width);
        }

        this.emptyBoard();

        var bot = new Piece(element_settings.bot.type, this.getRandDir(), element_settings.bot.color);
        this.putElement([0, 0], bot);

        for (var i = 0; i < gold_total; i++) {
            this.putElementRandom(element_settings.gold.type);
        }

        for (var i = 0; i < mine_total; i++) {
            this.putElementRandom(element_settings.mine.type);
        }

        for (var i = 0; i < enemy_total; i++) {
            this.putElementRandom(element_settings.enemy.type);
        }
    };

    this.getBoard = function () {
        return board;
    };

    this.setBoard = function (new_board) {
        board = new_board;
    };

    this.isValidCoord = function (row, col) {
        return 0 <= row && row < board_height && 0 <= col && col < board_width;
    };

    this.getLeft = function (cur_dir) {
        var res;
        switch (cur_dir) {
            case 'up':
                res = 'left';
                break;
            case 'left':
                res = 'down';
                break;
            case 'down':
                res = 'right';
                break;
            case 'right':
                res = 'up';
        }
        return res;
    }


    // Get next valid coordinate where the given enemy can move to
    this.getNextCoord = function (cur_row, cur_col, cur_dir) {
        var found_valid = false;
        var next_row, next_col;
        var next_dir = cur_dir;
        while (!found_valid) {
            next_row = cur_row + dir_map[next_dir][0];
            next_col = cur_col + dir_map[next_dir][1];

            if (this.isValidCoord(next_row, next_col)) {
                found_valid = true;
            } else {
                next_dir = this.getLeft(next_dir);
            }
        }
        var res = {
            next_row: next_row,
            next_col: next_col,
            next_dir: next_dir
        };
        return res;
    };


    this.updateBoard = function (bot_row, bot_col, bot_dir) {
        var prev_board = board.clone();
        this.emptyBoard();
//        console.log("emptyed board");

        // move other pieces
        for (var r = 0; r < board_height; r++) {
            for (var c = 0; c < board_width; c++) {
                switch (prev_board[r][c].getType()) {
                    case "empty":
                    case "bot":
                        break;
                    case "gold":
                    case "mine":
                        board[r][c] = prev_board[r][c];
                        break;
                    case "enemy":
//                        console.log(prev_board[r][c].getType());
                        var next_move = this.getNextCoord(r,c,prev_board[r][c].getDir());
//                        console.log("enemy_loc : ( " + next_move["next_row"] + ", " + next_move["next_col"] +")");
                        board[next_move["next_row"]][next_move["next_col"]] = new Piece(element_settings.enemy.type, next_move["next_dir"],element_settings.enemy.color);
                        break;
                }
            }
        }

        board[bot_row][bot_col] = new Piece(element_settings.bot.type, bot_dir, element_settings.bot.color);
    };
}