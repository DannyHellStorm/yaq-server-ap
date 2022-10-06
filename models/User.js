import { User as UserMapping } from './mapping.js';

class User {
  async getAll() {
    const users = await UserMapping.findAll();
    return users;
  }

  async getOne(id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error('Пользователь не найден в БД');
    }
    return user;
  }

  async getByEmail(email) {
    const user = await UserMapping.findOne({ where: { email } });
    if (!user) {
      throw new Error('Пользователь не найден в БД');
    }
    return user;
  }

  async create(data) {
    const { email, password, phone, role } = data;
    const user = await UserMapping.create({ email, password, phone, role });
    return user;
  }

  async update(id, data) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error('Пользователь не найден в БД');
    }
    const {
      email = user.email,
      password = user.password,
      phone = user.phone,
      role = user.role,
    } = data;
    await user.update({ email, password, phone, role });
    return user;
  }

  async delete(id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error('Пользователь не найден в БД');
    }
    await user.destroy();
    return user;
  }
}

export default new User();
