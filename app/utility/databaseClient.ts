import { Client } from "pg";

export const DBClient = () => {
  return new Client({
    host: "ec2-50-17-179-247.compute-1.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "user_service#2023",
    port: 5432,
  });
};

// RDS
//  host: "user-service.ctjt6qqqrh3e.us-east-1.rds.amazonaws.com",
//     user: "user_service",
//     database: "user_service",
//     password: "7681Meena",
//     port: 5432,
