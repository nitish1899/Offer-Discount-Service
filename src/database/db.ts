import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';
export const initDb = async () => await MikroORM.init(mikroOrmConfig);