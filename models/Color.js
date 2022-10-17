import { Color as ColorMapping } from './mapping.js';
import AppError from '../errors/AppError.js';

class Color {
  async getAll() {
    const colors = await ColorMapping.findAll();
    return colors;
  }

  async getOne(id) {
    const color = await ColorMapping.findByPk(id);
    if (!color) {
      throw new Error('Цвет не найден в БД');
    }
    return color;
  }

  async create(data) {
    const { name } = data;
    const color = await ColorMapping.create({ name });
    return color;
  }

  async update(id, data) {
    const color = await ColorMapping.findByPk(id);
    if (!color) {
      throw new Error('Цвет не найден в БД');
    }

    const { name = color.name } = data;
    await color.update({ name });
    return color;
  }

  async delete(id) {
    const color = await ColorMapping.findByPk(id);
    if (!color) {
      throw new Error('Цвет не найден в БД');
    }
    await color.destroy();
    return color;
  }
}

export default new Color();
