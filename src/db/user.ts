import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from 'sequelize'
import Seminar from './seminar'
import Series from './series'

export enum UserRole {
  NONE = 'NONE',
  SPEAKER = 'SPEAKER',
  ADMIN = 'ADMIN',
}

interface UserAttributes {
  email: string
  secret: string
  localName?: string | null
  englishName?: string | null
  role?: UserRole
}

interface UserCreationAttributes extends Optional<UserAttributes, 'email'> {}

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public email!: string
  public secret!: string
  public localName: string | null
  public englishName: string | null
  public role: UserRole

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getSeminar!: HasManyGetAssociationsMixin<Seminar>
  public addSeminar!: HasManyAddAssociationMixin<Seminar, number>
  public hasSeminar!: HasManyHasAssociationMixin<Seminar, number>
  public countSeminar!: HasManyCountAssociationsMixin
  public createSeminar!: HasManyCreateAssociationMixin<Seminar>

  public readonly seminars?: Seminar[]

  public getSeries!: HasManyGetAssociationsMixin<Series>
  public addSeries!: HasManyAddAssociationMixin<Series, number>
  public hasSeries!: HasManyHasAssociationMixin<Series, number>
  public countSeries!: HasManyCountAssociationsMixin
  public createSeries!: HasManyCreateAssociationMixin<Series>

  public readonly series?: Series[]

  public static associations: {
    seminars: Association<User, Seminar>
    series: Association<User, Series>
  }
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      secret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      localName: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      englishName: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      role: {
        type: DataTypes.ENUM(UserRole.NONE, UserRole.SPEAKER, UserRole.ADMIN),
        defaultValue: UserRole.NONE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      freezeTableName: true,
    },
  )
}

export function createAssociations() {
  User.belongsToMany(Seminar, { through: 'UserSeminar' })
  Seminar.belongsToMany(User, { through: 'UserSeminar' })
  User.belongsToMany(Series, { through: 'UserSeries' })
  Series.belongsToMany(User, { through: 'UserSeries' })
}
