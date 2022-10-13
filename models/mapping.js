import sequelize from '../sequelize.js';
import database from 'sequelize';

const { DataTypes } = database;

// модель «Пользователь», таблица БД «users»
const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

// модель «Корзина», таблица БД «baskets»
const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// связь между корзиной и товаром через промежуточную таблицу «basket_products»
// у этой таблицы будет составной первичный ключ (basket_id + product_id)
const BasketProduct = sequelize.define('basket_product', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

// модель «Товар», таблица БД «products»
const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
});

// модель «Категория», таблица БД «categories»
const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  parentId: { type: DataTypes.STRING },
});

// модель «Бренд», таблица БД «brands»
const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// модель «Размер», таблица БД «size»
const Size = sequelize.define('size', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// модель «Цвет», таблица БД «color»
const Color = sequelize.define('color', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: { type: DataTypes.STRING, unique: true, allowNull: false},
})

// свойства товара, у одного товара может быть много свойств
const ProductProp = sequelize.define('product_prop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
});

const Wishlist = sequelize.define('wishlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const WishlistProduct = sequelize.define('wishlist_product', {});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  comment: { type: DataTypes.STRING },
  prettyCreatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      const value = this.getDataValue('createdAt');
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      const hours = value.getHours();
      const minutes = value.getMinutes();
      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
    },
  },
  prettyUpdatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      const value = this.getDataValue('updatedAt');
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      const hours = value.getHours();
      const minutes = value.getMinutes();
      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
    },
  },
});

const OrderItem = sequelize.define('order_item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

Wishlist.belongsToMany(Product, {
  through: WishlistProduct,
  onDelete: 'CASCADE',
});
Product.belongsToMany(Wishlist, {
  through: WishlistProduct,
  onDelete: 'CASCADE',
});

Wishlist.hasMany(WishlistProduct);
WishlistProduct.belongsTo(Wishlist);
Product.hasMany(WishlistProduct);
WishlistProduct.belongsTo(Product);

Basket.belongsToMany(Product, { through: BasketProduct, onDelete: 'CASCADE' });
Product.belongsToMany(Basket, { through: BasketProduct, onDelete: 'CASCADE' });

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);
Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Category.hasMany(Product, { onDelete: 'RESTRICT' });
Product.belongsTo(Category);

Brand.hasMany(Product, { onDelete: 'RESTRICT' });
Product.belongsTo(Brand);

Size.hasMany(Product, { onDelete: 'RESTRICT'});
Product.belongsTo(Brand);

Color.hasMany(Product, { onDelete: 'RESTRICT'});
Product.belongsTo(Color);

Product.hasMany(ProductProp, { as: 'props', onDelete: 'CASCADE' });
ProductProp.belongsTo(Product);

Order.hasMany(OrderItem, { as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

User.hasMany(Order, { as: 'orders', onDelete: 'SET NULL' });
Order.belongsTo(User);

export {
  User,
  Basket,
  Product,
  Category,
  Brand,
  Size,
  Color,
  BasketProduct,
  ProductProp,
  Wishlist,
  WishlistProduct,
  Order,
  OrderItem,
};
