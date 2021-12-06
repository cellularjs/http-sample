import { PoolConfig as PgPoolConfig, PoolClient } from 'pg';

export interface PoolConfig extends PgPoolConfig { }
export class PoolConfig { }

export interface Client extends PoolClient { }
export class Client { }