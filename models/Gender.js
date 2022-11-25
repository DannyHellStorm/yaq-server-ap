import { Gender as GenderMapping } from './mapping.js';

class Gender {
  async getAll() {
    const genders = await GenderMapping.findAll();
    return genders;
  }

  async getOne(id) {
    const gender = await GenderMapping.findByPk(id);
    if (!gender) {
      throw new Error('Такой пол не найден в БД');
    }
    return gender;
  }

  async create(data) {
    const { genderName } = data;
    const gender = await GenderMapping.create({ genderName });
    return gender;
  }

  async update(id, data) {
    const gender = await GenderMapping.findByPk(id);
    if (!gender) {
      throw new Error('Такой пол не найден в БД');
    }

    const { genderName = color.genderName } = data;
    await gender.update({ genderName });
    return gender;
  }

  async delete(id) {
    const gender = await GenderMapping.findByPk(id);
    if (!gender) {
      throw new Error('Такой пол не найден в БД');
    }
    await gender.destroy();
    return gender;
  }
}

export default new Gender();
