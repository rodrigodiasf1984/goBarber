import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointement from '../app/models/Appointment';
import databaseConfig from '../config/database';

const models = [User, File, Appointement];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      // é preciso verificar se a ssociação existe para o model, se sim chama o método que fará a associação, neste caso associate()
      model => model.associate && model.associate(this.connection.models)
    );
  }
}
export default new Database();
