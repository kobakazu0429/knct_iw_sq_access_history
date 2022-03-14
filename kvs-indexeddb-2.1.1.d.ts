import type { KVS, KVSOptions } from "@kvs/types";
import type { JsonValue } from "@kvs/storage";
declare type IndexedDBOptions = {
    tableName?: string;
};
declare type IndexedDBResults = {
    dropInstance(): Promise<void>;
    __debug__database__: IDBDatabase;
};
export declare type KVSIndexedSchema = {
    [index: string]: JsonValue;
};
export declare type KVSIndexedDB<Schema extends KVSIndexedSchema> = KVS<Schema> & IndexedDBResults;
export declare type KvsIndexedDBOptions<Schema extends KVSIndexedSchema> = KVSOptions<Schema> & IndexedDBOptions;
export declare const kvsIndexedDB: <Schema extends KVSIndexedSchema>(options: KvsIndexedDBOptions<Schema>) => Promise<KVSIndexedDB<Schema>>;
export {};
