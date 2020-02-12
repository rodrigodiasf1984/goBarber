import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointement from '../app/models/Appointment';
import databaseConfig from '../config/database';

const models = [User, File, Appointement];
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    // essa a databse postgres
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      // é preciso verificar se a ssociação existe para o model, se sim chama o método que fará a associação, neste caso associate()
      model => model.associate && model.associate(this.connection.models)
    );
  }

  // Database MongoDB
  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
  }
}
export default new Database();
