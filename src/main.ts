// main.ts
import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, ExcaliburGraphicsContext, vec, Color, Actor, Vector, KeyEvent, Keys, BoundingBox } from "excalibur";
import { model, template } from "./UI/UI";

await UI.create(document.body, model, template).attached;

const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.FitScreenAndFill, // the display mode
  pixelArt: true,
  backgroundColor: Color.fromHex("#dc71aaff"),
});

await game.start();

let scene = game.currentScene;
let screen = game.screen;
let safeArea = game.screen.contentArea;

scene.onPreDraw = (ctx: ExcaliburGraphicsContext) => {
  ctx.drawRectangle(vec(0, 0), screen.width, screen.height, Color.fromHex("#334d56ff"));
  ctx.drawRectangle(vec(safeArea.left, safeArea.top), safeArea.width, safeArea.height, Color.fromHex("#875d19ff"));
};

class myTestActor extends Actor {
  speed = 100;
  constructor() {
    super({
      radius: 25,
      color: Color.Green,
      pos: vec(screen.width / 2, screen.height / 2),
    });
  }

  onPreUpdate(engine: Engine): void {
    if (engine.input.keyboard.isHeld(Keys.Left)) {
      this.vel = Vector.Left.scale(this.speed);
    } else if (engine.input.keyboard.isHeld(Keys.Right)) {
      this.vel = Vector.Right.scale(this.speed);
    } else if (engine.input.keyboard.isHeld(Keys.Up)) {
      this.vel = Vector.Up.scale(this.speed);
    } else if (engine.input.keyboard.isHeld(Keys.Down)) {
      this.vel = Vector.Down.scale(this.speed);
    } else {
      this.vel = Vector.Zero;
    }

    this.checkSafeAreaForCollider(engine);
  }

  checkSafeAreaForCollider(engine: Engine) {
    //get safe area
    let safeArea = this.getSafeArea();

    if (this.vel.x < 0 && this.pos.x < safeArea.left) {
      console.log("debug: ", this.pos.x, safeArea.left);

      this.vel.x = 0;
    }
    if (this.vel.x > 0 && this.pos.x > safeArea.right) {
      this.vel.x = 0;
    }
    if (this.vel.y < 0 && this.pos.y < safeArea.top) {
      this.vel = Vector.Zero;
    }
    if (this.vel.y > 0 && this.pos.y > safeArea.bottom) {
      this.vel = Vector.Zero;
    }
  }

  getSafeArea() {
    const { x: left, y: top } = game.screen.screenToWorldCoordinates(vec(game.screen.contentArea.left, game.screen.contentArea.top));
    const { x: right, y: bottom } = game.screen.screenToWorldCoordinates(
      vec(game.screen.contentArea.right, game.screen.contentArea.bottom)
    );
    return new BoundingBox({
      top,
      left,
      right,
      bottom,
    });
    //return game.screen.contentArea;
  }
}

game.add(new myTestActor());
