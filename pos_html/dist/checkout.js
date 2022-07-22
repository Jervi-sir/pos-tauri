"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_json_1 = __importDefault(require("./employee.json"));
// 👇️ "JAMES DOE"
console.log(employee_json_1.default.name.toUpperCase());
// 👇️ [2022, 2023, 2024]
console.log(employee_json_1.default.years);
