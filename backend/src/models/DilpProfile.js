import { query } from '../config/db';

export function create(data) {
    return query(
        `INSERT INTO application`, data
    );
}