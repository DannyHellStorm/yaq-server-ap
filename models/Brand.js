import { Brand as BrandMapping } from './mapping.js';
import AppError from '../errors/AppError.js';

class Brand {
  async getAll() {
    const brands = await BrandMapping.findAll();
    return brands;
  }

  async getOne(id) {
    const brand = await BrandMapping.findByPk(id);
    if (!brand) {
      throw new Error('Бренд не найден в БД');
    }
    return brand;
  }

  async create(data) {
    const { brandName } = data;
    const brand = await BrandMapping.create({ brandName });
    return brand;
  }

  async update(id, data) {
    const brand = await BrandMapping.findByPk(id);
    if (!brand) {
      throw new Error('Бренд не найден в БД');
    }
    const { brandName = brand.brandName } = data;
    await brand.update({ brandName });
    return brand;
  }

  async delete(id) {
    const brand = await BrandMapping.findByPk(id);
    if (!brand) {
      throw new Error('Бренд не найден в БД');
    }
    await brand.destroy();
    return brand;
  }
}

export default new Brand();
