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

// свойства товара, у одного товара может быть много свойств
const ProductProp = sequelize.define('product_prop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
});

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

Product.hasMany(ProductProp, { as: 'props', onDelete: 'CASCADE' });
ProductProp.belongsTo(Product);

export { User, Basket, Product, Category, Brand, BasketProduct, ProductProp };
