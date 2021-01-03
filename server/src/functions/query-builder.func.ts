import {Request} from 'express';
import isBlank from 'is-blank';
import {Vars} from '../vars';


export function buildQuery(config: QueryBuilderConfig, req: Request): QueryBuilderData {
    if (config.allowLimitAndOffset) {
        config.query = buildLimitAndOffset(config.query, req);
    }
    if (config.allowedSearchFields && config.searchString) {
        config.query = buildOrLikeSearchQuery(config.query, config.searchString, config.allowedSearchFields);
    }
    if (config.allowedFilterFields && config.customFilterResolver) {
        config.query = buildFilter(config.query, req, config.allowedFilterFields, config.customFilterResolver);
    }
    if (config.allowedOrderFields) {
        config.query = buildOrder(config.query, req, config.allowedOrderFields);
    }
    return config.query;
}

export function buildLimitAndOffset(query: QueryBuilderData, req: Request) {
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

export function buildOrder(query: QueryBuilderData, req: Request, allowedOrders: string[] = []) {
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

export function buildOrLikeSearchQuery(query: QueryBuilderData, needle: string, allowedFields: string[] = []) {
    let length = 0;
    const search = {
        [Vars.op.or]: allowedFields.map(field => {
            const a: { [name: string]: unknown } = {};
            a[field] = {
                [Vars.op.iLike]: '%' + needle + '%'
            };
            length++;
            return a;
        }
        )
    };
    query = mergeQueryBuilders(query, search);
    return query;
}


export function buildFilter(query: QueryBuilderData, req: Request, allowedFields: string[] = [], customResolver: customFilterResolverMap) {
    const filter: { [name: string]: string } = {};
    allowedFields.forEach(field => {
        let value = '';
        if (req.query[field] != undefined && !isBlank(req.query[field])) {
            value = req.query[field] as string;
        }
        if (customResolver.has(field) && customResolver.get(field) != undefined) {
            const fun = customResolver.get(field);
            if (fun != undefined) {
                value = fun.call(0, field, req, value);
            }
        }
        if (value !== '') {
            filter[field] = value;
        }
    });
    query = mergeQueryBuilders(query, filter);
    return query;
}

function mergeQueryBuilders(query: QueryBuilderData, newQuery: any): QueryBuilderData {
    if (Object.prototype.hasOwnProperty.call(query, 'where')) {
        query.where = {
            ...query.where,
            ...newQuery
        };
    } else {
        // !Object.keys(search).length is not working here, don't know why
        query.where = newQuery;
    }
    return query;
}

export interface QueryBuilderData {
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
