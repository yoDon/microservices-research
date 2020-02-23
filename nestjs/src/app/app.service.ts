import { 
    Injectable,
    // Logger,
} from "@nestjs/common";

// const logger = new Logger("app.service.ts");

@Injectable()
class AppService {
    getHello(): string {
        return "Hello World!";
    }
}

export { AppService };
