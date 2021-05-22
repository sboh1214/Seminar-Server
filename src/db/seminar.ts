import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

interface SeminarAttributes {
  id: number
}

interface SeminarCreationAttributes extends Optional<SeminarAttributes, 'id'> {}

export default class Seminar
  extends Model<SeminarAttributes, SeminarCreationAttributes>
  implements SeminarAttributes
{
  public id!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export function initSeminar(sequelize: Sequelize) {
  Seminar.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'Seminar',
    },
  )
}
