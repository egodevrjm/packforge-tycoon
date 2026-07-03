import Phaser from "phaser";
import type { GameController, GameSnapshot } from "../../app/controller";
import { getPhaserController } from "./controllerBridge";

const isoTileWidth = 72;
const isoTileHeight = 36;
const tileHalfWidth = isoTileWidth / 2;
const tileHalfHeight = isoTileHeight / 2;
const boardOriginY = 84;

export class GameScene extends Phaser.Scene {
  private controller!: GameController;
  private snapshot!: GameSnapshot;
  private unsubscribe?: () => void;
  private worldLayer!: Phaser.GameObjects.Graphics;
  private labelLayer!: Phaser.GameObjects.Container;
  private isDragging = false;
  private lastPointer?: Phaser.Math.Vector2;

  constructor() {
    super("GameScene");
  }

  create() {
    this.controller = getPhaserController();
    this.worldLayer = this.add.graphics();
    this.labelLayer = this.add.container(0, 0);
    this.cameras.main.setBackgroundColor("#40392f");
    this.cameras.main.setZoom(1);

    this.unsubscribe = this.controller.subscribe((snapshot) => {
      this.snapshot = snapshot;
      this.redraw();
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        this.isDragging = true;
        this.lastPointer = new Phaser.Math.Vector2(pointer.x, pointer.y);
        return;
      }
      this.controller.setSelection({ type: "inspect" });
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.isDragging || !this.lastPointer) {
        return;
      }
      const camera = this.cameras.main;
      camera.scrollX -= (pointer.x - this.lastPointer.x) / camera.zoom;
      camera.scrollY -= (pointer.y - this.lastPointer.y) / camera.zoom;
      this.lastPointer.set(pointer.x, pointer.y);
    });

    this.input.on("pointerup", () => {
      this.isDragging = false;
      this.lastPointer = undefined;
    });

    this.input.on(
      "wheel",
      (_pointer: Phaser.Input.Pointer, _objects: unknown, _dx: number, dy: number) => {
        const camera = this.cameras.main;
        camera.setZoom(Phaser.Math.Clamp(camera.zoom + (dy > 0 ? -0.08 : 0.08), 0.55, 1.7));
      }
    );
  }

  destroy() {
    this.unsubscribe?.();
  }

  private handlePrimaryPointer(pointer: Phaser.Input.Pointer) {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const { x, y } = this.worldToGrid(worldPoint.x, worldPoint.y);
    const selection = this.snapshot.selection;

    if (selection.type === "build") {
      this.controller.dispatch({
        type: "placeBuilding",
        buildingId: selection.buildingId,
        x,
        y
      });
      return;
    }

    if (selection.type === "remove") {
      const placed = this.snapshot.state.buildings.find((building) => {
        const definition = this.snapshot.pack.buildings.find((item) => item.id === building.buildingId);
        if (!definition) {
          return false;
        }
        return (
          x >= building.x &&
          y >= building.y &&
          x < building.x + definition.size.width &&
          y < building.y + definition.size.height
        );
      });
      if (placed) {
        this.controller.dispatch({ type: "removeBuilding", buildingId: placed.id });
      }
    }
  }

  private redraw() {
    this.worldLayer.clear();
    this.labelLayer.removeAll(true);
    this.drawGround();
    this.drawPlacementHint();
    this.drawBuildings();
  }

  private drawGround() {
    const { grid } = this.snapshot.state;
    for (let y = 0; y < grid.height; y += 1) {
      for (let x = 0; x < grid.width; x += 1) {
        const center = this.gridToWorld(x + 0.5, y + 0.5);
        const tint = (x + y) % 2 === 0 ? 0x675a48 : 0x5d5142;
        this.worldLayer.fillStyle(tint, 1);
        this.worldLayer.lineStyle(1, 0x9b8a6f, 0.5);
        this.drawDiamond(center.x, center.y, isoTileWidth, isoTileHeight, true);
      }
    }
  }

  private drawBuildings() {
    const elapsed = this.snapshot.state.elapsedMs;
    for (const placed of this.snapshot.state.buildings) {
      const definition = this.snapshot.pack.buildings.find((building) => building.id === placed.buildingId);
      const recipe = definition?.recipeId
        ? this.snapshot.pack.recipes.find((item) => item.id === definition.recipeId)
        : undefined;
      if (!definition) {
        continue;
      }

      const corners = this.footprintCorners(
        placed.x,
        placed.y,
        definition.size.width,
        definition.size.height
      );
      const color = Phaser.Display.Color.HexStringToColor(definition.color).color;
      const pulse = 0.88 + Math.sin(elapsed / 260 + placed.x) * 0.05;

      this.worldLayer.fillStyle(color, 0.45);
      this.worldLayer.lineStyle(2, 0x2f2a25, 0.7);
      this.worldLayer.beginPath();
      this.worldLayer.moveTo(corners[0].x, corners[0].y);
      for (const corner of corners.slice(1)) {
        this.worldLayer.lineTo(corner.x, corner.y);
      }
      this.worldLayer.closePath();
      this.worldLayer.fillPath();
      this.worldLayer.strokePath();

      const center = this.gridToWorld(
        placed.x + definition.size.width / 2,
        placed.y + definition.size.height / 2
      );
      this.worldLayer.fillStyle(color, pulse);
      this.drawDiamond(center.x, center.y - 16, 48, 28, true);

      if (recipe) {
        const progress = Phaser.Math.Clamp(placed.progressMs / recipe.durationMs, 0, 1);
        this.worldLayer.fillStyle(0x2f2a25, 0.65);
        this.worldLayer.fillRoundedRect(center.x - 34, center.y + 18, 68, 6, 3);
        this.worldLayer.fillStyle(0xffbe4f, 1);
        this.worldLayer.fillRoundedRect(center.x - 34, center.y + 18, 68 * progress, 6, 3);
      }

      const label = this.add
        .text(center.x, center.y + 34, definition.name, {
          color: "#fff3d8",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          fontStyle: "700",
          align: "center",
          stroke: "#201d19",
          strokeThickness: 3,
          wordWrap: { width: 92 }
        })
        .setOrigin(0.5);
      this.labelLayer.add(label);
    }
  }

  private drawPlacementHint() {
    const selection = this.snapshot.selection;
    if (selection.type !== "build") {
      return;
    }
    const building = this.snapshot.pack.buildings.find((item) => item.id === selection.buildingId);
    if (!building) {
      return;
    }

    for (let y = 0; y <= this.snapshot.state.grid.height - building.size.height; y += 1) {
      for (let x = 0; x <= this.snapshot.state.grid.width - building.size.width; x += 1) {
        const occupied = this.snapshot.state.buildings.some((placed) => {
          const placedDef = this.snapshot.pack.buildings.find(
            (item) => item.id === placed.buildingId
          );
          if (!placedDef) {
            return false;
          }
          return (
            placed.x < x + building.size.width &&
            placed.x + placedDef.size.width > x &&
            placed.y < y + building.size.height &&
            placed.y + placedDef.size.height > y
          );
        });
        if (occupied) {
          continue;
        }

        const corners = this.footprintCorners(x, y, building.size.width, building.size.height);
        const center = this.gridToWorld(x + building.size.width / 2, y + building.size.height / 2);
        this.worldLayer.fillStyle(0xffbe4f, 0.12);
        this.worldLayer.lineStyle(3, 0xffbe4f, 0.9);
        this.worldLayer.beginPath();
        this.worldLayer.moveTo(corners[0].x, corners[0].y);
        for (const corner of corners.slice(1)) {
          this.worldLayer.lineTo(corner.x, corner.y);
        }
        this.worldLayer.closePath();
        this.worldLayer.fillPath();
        this.worldLayer.strokePath();
        const label = this.add
          .text(center.x, center.y, "Tap to place", {
            color: "#fff3d8",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            fontStyle: "700",
            align: "center",
            stroke: "#201d19",
            strokeThickness: 3
          })
          .setOrigin(0.5);
        this.labelLayer.add(label);
        return;
      }
    }
  }

  private gridToWorld(x: number, y: number) {
    return {
      x: (x - y) * tileHalfWidth + this.boardOriginX(),
      y: (x + y) * tileHalfHeight + boardOriginY
    };
  }

  private worldToGrid(worldX: number, worldY: number) {
    const dx = worldX - this.boardOriginX();
    const dy = worldY - boardOriginY;
    return {
      x: Math.floor((dy / tileHalfHeight + dx / tileHalfWidth) / 2),
      y: Math.floor((dy / tileHalfHeight - dx / tileHalfWidth) / 2)
    };
  }

  private boardOriginX() {
    return this.snapshot.state.grid.height * tileHalfWidth + 92;
  }

  private footprintCorners(x: number, y: number, width: number, height: number) {
    return [
      this.gridToWorld(x, y),
      this.gridToWorld(x + width, y),
      this.gridToWorld(x + width, y + height),
      this.gridToWorld(x, y + height)
    ];
  }

  private drawDiamond(x: number, y: number, width: number, height: number, fill: boolean) {
    this.worldLayer.beginPath();
    this.worldLayer.moveTo(x, y - height / 2);
    this.worldLayer.lineTo(x + width / 2, y);
    this.worldLayer.lineTo(x, y + height / 2);
    this.worldLayer.lineTo(x - width / 2, y);
    this.worldLayer.closePath();
    if (fill) {
      this.worldLayer.fillPath();
    }
    this.worldLayer.strokePath();
  }
}
