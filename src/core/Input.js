export default class Input {

    constructor() {

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.setupKeyboard();
    }


    setupKeyboard() {

        window.addEventListener("keydown", (event) => {

            switch (event.key.toLowerCase()) {

                case "w":
                case "arrowup":
                    this.keys.forward = true;
                    break;

                case "s":
                case "arrowdown":
                    this.keys.backward = true;
                    break;

                case "a":
                case "arrowleft":
                    this.keys.left = true;
                    break;

                case "d":
                case "arrowright":
                    this.keys.right = true;
                    break;
            }
        });


        window.addEventListener("keyup", (event) => {

            switch (event.key.toLowerCase()) {

                case "w":
                case "arrowup":
                    this.keys.forward = false;
                    break;

                case "s":
                case "arrowdown":
                    this.keys.backward = false;
                    break;

                case "a":
                case "arrowleft":
                    this.keys.left = false;
                    break;

                case "d":
                case "arrowright":
                    this.keys.right = false;
                    break;
            }
        });
    }
}