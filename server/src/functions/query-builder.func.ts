import {Request} from 'express';
import isBlank from 'is-blank';
import {Vars} from '../vars';
import {FindOptions} from 'sequelize';
import {Includeable} from 'sequelize/types/lib/model';


export function buildQuery(config: QueryBuilderConfig, req: Request): QueryBuilderData {
    if (config.allowLimitAndOffset) {
        config.query = buildLimitAndOffset(config.query, req);
    }
    if (config.allowedSearchFields && config.searchString) {
        config.query = buildOrLikeSearchQuery(config.query, config.searchString, config.allowedSearchFields);
    }
    if (config.allowedFilterFields) {
        config.query = buildFilter(config.query, req, config.allowedFilterFields, config.customFilterResolver);
    }
    if (config.allowedOrderFields) {
        config.query = buildOrder(config.query, req, config.allowedOrderFields);
    }
    return config.query;
}

export function buildLimitAndOffset(query: QueryBuilderData, req: Request): QueryBuilderData {
    if (req.query.limit && !isBlank(req.query.limit)) {
        if (req.query.offset && !isBlank(req.query.offset)) {
            return {
                ...query,
                ...{
                    offset: parseInt(req.query.offset as string),
                    limit: parseInt(req.query.limit as string),
                }
            };
        }
        return {
            ...query,
            ...{
                limit: parseInt(req.query.limit as string),
            }
        };
    }
    return query;
}

export function buildOrder(query: QueryBuilderData, req: Request, allowedOrders: string[] = []): QueryBuilderData {
    if (req.query.order && !isBlank(req.query.order) || req.query.sort && !isBlank(req.query.sort)) {
        let o = req.query.order as string || req.query.sort as string;
        let direction = 'DESC';
        if (o.charAt(0) === '-') {
            direction = 'ASC';
            o = o.substring(1);
        }
        if (allowedOrders.includes(o)) {
            return {
                ...query,
                order: [
                    [o, direction]
                ]
            };
        }
    }
    return query;
}

export function buildOrLikeSearchQuery(query: QueryBuilderData, needle: string, allowedFields: string[] = []): QueryBuilderData {
    const search = {
        [Vars.op.or]: allowedFields.map(
            field => {
                const a: { [name: string]: unknown } = {};
                a[field] = {
                    [Vars.op.iLike]: '%' + needle + '%'
                };
                return a;
            }
        )
    };
    query = mergeQueryBuilderField(query, search);
    return query;
}

export function buildFilter(query: QueryBuilderData, req: Request, allowedFields: string[] = [], customResolver: customFilterResolverMap | undefined): QueryBuilderData {
    const filter: { [name: string]: string } = {};
    allowedFields.forEach(field => {
        let value = '';
        if (req.query[field] != undefined && !isBlank(req.query[field])) {
            value = req.query[field] as string;
        }
        if (customResolver != undefined) {
            if (customResolver.has(field) && customResolver.get(field) != undefined) {
                const fun = customResolver.get(field);
                if (fun != undefined) {
                    value = fun.call(0, field, req, value);
                }
            }
        }
        if (value !== '') {
            filter[field] = value;
        }
    });
    query = mergeQueryBuilderField(query, filter);
    return query;
}

function mergeQueryBuilderField(query: QueryBuilderData, newQuery: { [s: string]: unknown }, fieldName: keyof QueryBuilderData = 'where'): QueryBuilderData {
    if (Object.prototype.hasOwnProperty.call(query, fieldName)) {
        query[fieldName] = {
            ...query[fieldName],
            ...newQuery
        };
    } else {
        // !Object.keys(search).length is not working here, don't know why
        query[fieldName] = newQuery;
    }
    return query;
}

export function addRelations(query: QueryBuilderData, models: Includeable): QueryBuilderData {
    const include = {include: models};
    return mergeQueryBuilderField(query, include);
}

export interface QueryBuilderData extends FindOptions {
    where?: any;
    offset?: number;
    limit?: number;
    raw?: boolean;
}

export type customFilterValueResolver = ((field: string, req: Request, value: string) => any);
export type customFilterResolverMap = Map<string, customFilterValueResolver>;

export interface QueryBuilderConfig {
    query: QueryBuilderData;
    allowedOrderFields?: string[];
    allowedSearchFields?: string[];
    allowLimitAndOffset: boolean;
    allowedFilterFields?: string[];
    customFilterResolver?: customFilterResolverMap;
    searchString?: string;
}
