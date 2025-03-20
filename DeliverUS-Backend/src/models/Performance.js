// This is a new file for solution!
import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class Performance extends Model {
/**
* Helper method for defining associations.
* This method is not a part of Sequelize lifecycle.
* The `models/index` file will call this method automatically.
*/
static associate (models) {
// SOLUCION
  Performance.belongsTo(models.Restaurant, { foreignKey:
  'restaurantId', as: 'restaurant', onDelete: 'cascade' })
  }
}
// SOLUCION
// "id", "group", "appointment" y "restaurantId"
Performance.init({
  group: DataTypes.STRING,
  appointment: DataTypes.DATE,
  restaurantId: DataTypes.INTEGER
  }, {
  sequelize,
  modelName: 'Performance'
  })
  return Performance
}
export default loadModel