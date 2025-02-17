"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    const PORT = process.env.PORT || 5000;
    await app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map