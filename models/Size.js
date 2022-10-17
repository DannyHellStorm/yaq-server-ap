import { Size as SizeMapping } from './mapping.js';
import AppError from '../errors/AppError.js';

class Size {
  async getAll() {
    const sizes = await SizeMapping.findAll();
    return sizes;
  }

  async getOne(id) {
    const size = await SizeMapping.findByPk(id);
    if (!size) {
      throw new Error('Размер не найден в БД');
    }
    return size;
  }

  async create(data) {
    const { name } = data;
    const size = await SizeMapping.create({ name });
    return size;
  }

  async update(id, data) {
    const size = await SizeMapping.findByPk(id);
    if (!size) {
      throw new Error('Размер не найден в БД');
    }

    const { name = size.name } = data;
    await size.update({ name });
    return size;
  }

  async delete(id) {
    const size = await SizeMapping.findByPk(id);
    if (!size) {
      throw new Error('Размер не найден в БД');
    }

    await size.destroy();
    return size;
  }
}

export default new Size();
