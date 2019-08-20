const config = {};

config.PORT = 2000;
config.DB_URL = 'ds149706.mlab.com:49706/odyssey';
config.FRAMERATE = 1000 / 60;
config.BACKUP_TIME = 120;

config.MAP_LAYERS = 6;
config.MAP_COLUMNS = 12;
config.MAP_ROWS = 12;

config.MAX_MAPS = 10;
config.MAX_USERS = 100;
config.MAX_SPRITES = 13;
config.MAX_EFFECTS = 71;
config.MAX_LEVEL = 30;

config.MAX_HEALTH_BASE = 200;
config.MAX_HEALTH_BONUS = 55;
config.MAX_ENERGY_BASE = 200;
config.MAX_ENERGY_BONUS = 55;

config.INVENTORY_SIZE = 20;
config.EQUIPMENT_SIZE = 5;

config.ITEM_TYPES = [
  {name: "Normal", equippedSlot: null, stackable: false},
  {name: "Stacking", equippedSlot: null, stackable: true},
  {name: "Weapon", equippedSlot: 0, stackable: false},
  {name: "Shield", equippedSlot: 1, stackable: false},
  {name: "Armour", equippedSlot: 2, stackable: false},
  {name: "Helmet", equippedSlot: 3, stackable: false},
  {name: "Ring", equippedSlot: 4, stackable: false}
];

export default config;
