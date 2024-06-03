"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ValidEnvironment_1 = require("./config/ValidEnvironment");
const router_1 = __importDefault(require("./routers/router"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = ValidEnvironment_1.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default
    .connect(ValidEnvironment_1.urlMongoDBN)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
app.use(router_1.default);
app.listen(port, () => {
    console.log(`Auth service running on port ${port}`);
});
//# sourceMappingURL=app.js.map