import * as uuid from 'uuid';
import * as path from 'path';

class File {
  save(file) {
    if (!file) return null;
    const [, ext] = file.mimetype.split('/');
    const fileName = uuid.v4() + '.' + ext;
    const filePath = path.resolve('static', fileName);
    file.mv(filePath);
    return fileName;
  }
}

export default new File();
