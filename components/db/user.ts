import { DataTypes, Model} from 'https://deno.land/x/denodb/mod.ts';

export default class User extends Model {
  static table = 'users';

  static timestamps = true;

  static fields = {
    id: {
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    pwd: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      length: 50,
    },
  };
}