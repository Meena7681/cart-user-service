"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const pg_1 = require("pg");
const DBClient = () => {
    return new pg_1.Client({
        host: "ec2-50-17-179-247.compute-1.amazonaws.com",
        user: "user_service",
        database: "user_service",
        password: "user_service#2023",
        port: 5432,
    });
};
exports.DBClient = DBClient;
// RDS
//  host: "user-service.ctjt6qqqrh3e.us-east-1.rds.amazonaws.com",
//     user: "user_service",
//     database: "user_service",
//     password: "7681Meena",
//     port: 5432,
//# sourceMappingURL=databaseClient.js.map