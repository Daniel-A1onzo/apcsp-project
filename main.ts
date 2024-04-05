namespace SpriteKind {
    export const HitBox = SpriteKind.create()
    export const QuestNPC = SpriteKind.create()
    export const Bat = SpriteKind.create()
    export const Snake = SpriteKind.create()
    export const Weapon = SpriteKind.create()
    export const Item = SpriteKind.create()
    export const Portal = SpriteKind.create()
}
namespace StatusBarKind {
    export const SkelHP = StatusBarKind.create()
    export const SnakeHP = StatusBarKind.create()
    export const SkeletonHP = StatusBarKind.create()
    export const BatHP = StatusBarKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
})
function PlayerMenu () {
    MenuItems = [miniMenu.createMenuItem("Stats"), miniMenu.createMenuItem("Inventory")]
    PlayerMenu2 = miniMenu.createMenuFromArray(MenuItems)
    OpenedMenu = true
    PlayerMenu2.setFlag(SpriteFlag.Invisible, !(OpenedMenu))
    PlayerMenu2.setTitle("Menu")
    PlayerMenu2.setDimensions(100, 100)
    tiles.placeOnTile(PlayerMenu2, PlayerSprite.tilemapLocation())
    PlayerMenu2.setStyleProperty(miniMenu.StyleKind.DefaultAndSelected, miniMenu.StyleProperty.Margin, miniMenu.createBorderBox(
    0,
    0,
    0,
    0
    ))
    PlayerMenu2.setStyleProperty(miniMenu.StyleKind.DefaultAndSelected, miniMenu.StyleProperty.Border, miniMenu.createBorderBox(
    0,
    0,
    0,
    0
    ))
    PlayerMenu2.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 4)
    PlayerMenu2.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 11)
    PlayerMenu2.setStyleProperty(miniMenu.StyleKind.DefaultAndSelected, miniMenu.StyleProperty.Alignment, 1)
    PlayerMenu2.top = 80
    PlayerMenu2.right = 160
    PlayerMenu2.z = 0
    PlayerMenu2.setFlag(SpriteFlag.RelativeToCamera, true)
    controller.moveSprite(PlayerSprite, 0, 0)
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    PlayerMenu()
    PlayerMenu2.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selection == "Inventory") {
            CreateInventory()
            PlayerMenu2.setButtonEventsEnabled(false)
        }
        if (selection == "Stats") {
            game.showLongText("Level: " + PlayerLevel, DialogLayout.Left)
        }
    })
    PlayerMenu2.onButtonPressed(controller.B, function (selection, selectedIndex) {
        if (OpenedMenu == true) {
            PlayerMenu2.close()
        }
        controller.moveSprite(PlayerSprite)
    })
})
function Start () {
    Exp = 0
    ReqExp = 10
    QNPC1 = sprites.create(assets.image`NPC1`, SpriteKind.QuestNPC)
    QNPC2 = sprites.create(assets.image`NPC3`, SpriteKind.QuestNPC)
    QNPC3 = sprites.create(assets.image`NPC2`, SpriteKind.QuestNPC)
    Portal2 = sprites.create(assets.image`Portal`, SpriteKind.Portal)
    tiles.placeOnTile(Portal2, tiles.getTileLocation(101, 101))
    PlayerLevel = 1
    EnemyDmg = [1, 2]
    PlayerSprite = sprites.create(assets.image`myImage`, SpriteKind.Player)
    controller.moveSprite(PlayerSprite)
    scene.cameraFollowSprite(PlayerSprite)
    tiles.setCurrentTilemap(tilemap`Overworld`)
    PlayerMagic = statusbars.create(20, 4, StatusBarKind.Magic)
    PlayerHP = statusbars.create(40, 8, StatusBarKind.Health)
    PlayerMagic.positionDirection(CollisionDirection.Top)
    PlayerMagic.setOffsetPadding(70, 8)
    PlayerHP.positionDirection(CollisionDirection.Top)
    PlayerHP.setOffsetPadding(60, 0)
    PlayerHP.setColor(12, 0)
}
function Boss_Fight (DMGImn: number, Attack: any[]) {
    BossProjectile = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . 3 3 3 . . . . . . . 
        . . . . . 3 3 3 3 3 . . . . . . 
        . . . . . 3 3 3 3 3 . . . . . . 
        . . . . . . 3 3 3 . . . . . . . 
        . . . . . . . 3 . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Projectile)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.QuestNPC, function (sprite, otherSprite) {
    if (controller.A.isPressed() == true) {
        Quests(otherSprite)
    }
})
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    DefeatedEnemies += 1
})
function Quests (NPC: Sprite) {
    ReqEnem = 5 * PlayerLevel / (PlayerLevel / 2)
    HuntQuest = "Defeat " + ReqEnem + " enemies"
    if (PlayerSprite.overlapsWith(QNPC1)) {
        game.showLongText(HuntQuest, DialogLayout.Bottom)
        game.setDialogCursor(assets.image`NPC1`)
        DefeatedEnemies = 0
        textSprite = textsprite.create("" + DefeatedEnemies + "/" + ReqEnem)
        tiles.placeOnTile(textSprite, tiles.getTileLocation(0, 0))
        textSprite.setFlag(SpriteFlag.RelativeToCamera, true)
        textSprite.setOutline(1, 15)
    }
}
// Code provided by ___ on the make code arcade forum.
function CreateInventory () {
    ItemList = [Inventory.create_item("Starter's Blade", assets.image`StarterSword`, "Test descripiton")]
    inventory = Inventory.create_inventory(ItemList, 100)
    inventory.set_number(InventoryNumberAttribute.SelectedIndex, -1)
    OpenedInventory = true
    inventory.setFlag(SpriteFlag.Invisible, !(OpenedInventory))
    tiles.placeOnTile(inventory, PlayerSprite.tilemapLocation())
    inventory.setFlag(SpriteFlag.RelativeToCamera, true)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (true) {
    	
    } else {
        animation.runImageAnimation(
        PlayerSprite,
        assets.animation`Attack`,
        100,
        false
        )
        AttackHitBox = sprites.create(assets.image`ProtoHitbox`, SpriteKind.HitBox)
        tiles.placeOnTile(AttackHitBox, PlayerSprite.tilemapLocation())
        AttackHitBox.follow(PlayerSprite)
        pause(100)
        sprites.destroy(AttackHitBox)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (OpenedInventory == true) {
        inventory.setFlag(SpriteFlag.Invisible, true)
        PlayerMenu2.setButtonEventsEnabled(true)
    }
})
// Source Code provided By teacher
function Monster_Spawns (PlayerLevel: number) {
    SpawnLocation = tiles.getTilesByType(sprites.castle.tileGrass1)
    EnemySprites = [sprites.create(img`
        ........................
        ........................
        ........................
        ........................
        ..........ffff..........
        ........ff1111ff........
        .......fb111111bf.......
        .......f11111111f.......
        ......fd11111111df......
        ......fd11111111df......
        ......fddd1111dddf......
        ......fbdbfddfbdbf......
        ......fcdcf11fcdcf......
        .......fb111111bf.......
        ......fffcdb1bdffff.....
        ....fc111cbfbfc111cf....
        ....f1b1b1ffff1b1b1f....
        ....fbfbffffffbfbfbf....
        .........ffffff.........
        ...........fff..........
        ........................
        ........................
        ........................
        ........................
        `, SpriteKind.Enemy), sprites.create(img`
        . . f f f . . . . . . . . . . . 
        f f f c c . . . . . . . . f f f 
        f f c c . . c c . . . f c b b c 
        f f c 3 c c 3 c c f f b b b c . 
        f f b 3 b c 3 b c f b b c c c . 
        . c b b b b b b c f b c b c c . 
        . c b b b b b b c b b c b b c . 
        c b 1 b b b 1 b b b c c c b c . 
        c b b b b b b b b c c c c c . . 
        f b c b b b c b b b b f c . . . 
        f b 1 f f f 1 b b b b f c c . . 
        . f b b b b b b b b c f . . . . 
        . . f b b b b b b c f . . . . . 
        . . . f f f f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Enemy), sprites.create(img`
        . . . . c c c c c c . . . . . . 
        . . . c 6 7 7 7 7 6 c . . . . . 
        . . c 7 7 7 7 7 7 7 7 c . . . . 
        . c 6 7 7 7 7 7 7 7 7 6 c . . . 
        . c 7 c 6 6 6 6 c 7 7 7 c . . . 
        . f 7 6 f 6 6 f 6 7 7 7 f . . . 
        . f 7 7 7 7 7 7 7 7 7 7 f . . . 
        . . f 7 7 7 7 6 c 7 7 6 f c . . 
        . . . f c c c c 7 7 6 f 7 7 c . 
        . . c 7 2 7 7 7 6 c f 7 7 7 7 c 
        . c 7 7 2 7 7 c f c 6 7 7 6 c c 
        c 1 1 1 1 7 6 f c c 6 6 6 c . . 
        f 1 1 1 1 1 6 6 c 6 6 6 6 f . . 
        f 6 1 1 1 1 1 6 6 6 6 6 c f . . 
        . f 6 1 1 1 1 1 1 6 6 6 f . . . 
        . . c c c c c c c c c f . . . . 
        `, SpriteKind.Enemy)]
    if (PlayerLevel / 30 >= 1) {
        for (let index = 0; index < PlayerLevel * 2; index++) {
            Enemies = EnemySprites._pickRandom()
            tiles.placeOnTile(Enemies, SpawnLocation.removeAt(randint(0, SpawnLocation.length - 1)))
        }
    }
    for (let index = 0; index < PlayerLevel; index++) {
        Enemies = EnemySprites._pickRandom()
        tiles.placeOnTile(Enemies, SpawnLocation.removeAt(randint(0, SpawnLocation.length - 1)))
    }
}
let Enemies: Sprite = null
let EnemySprites: Sprite[] = []
let SpawnLocation: tiles.Location[] = []
let AttackHitBox: Sprite = null
let OpenedInventory = false
let inventory: Inventory.Inventory = null
let ItemList: Inventory.Item[] = []
let textSprite: TextSprite = null
let HuntQuest = ""
let ReqEnem = 0
let DefeatedEnemies = 0
let BossProjectile: Sprite = null
let PlayerHP: StatusBarSprite = null
let PlayerMagic: StatusBarSprite = null
let EnemyDmg: number[] = []
let QNPC3: Sprite = null
let QNPC2: Sprite = null
let QNPC1: Sprite = null
let ReqExp = 0
let Exp = 0
let PlayerLevel = 0
let PlayerSprite: Sprite = null
let OpenedMenu = false
let PlayerMenu2: miniMenu.MenuSprite = null
let MenuItems: miniMenu.MenuItem[] = []
let Portal2: Sprite = null
Start()
scaling.scaleToPercent(Portal2, 300, ScaleDirection.Uniformly, ScaleAnchor.Middle)
game.onUpdateInterval(500, function () {
    if (ReqExp == Exp) {
        Exp = 0
        ReqExp = ReqExp * 2
    }
})
game.onUpdateInterval(5000, function () {
    Monster_Spawns(PlayerLevel)
})
