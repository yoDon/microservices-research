import { IsString } from "class-validator";

interface ICreateDemoDto {
    readonly one: string;
    readonly two: string;
}

class CreateDemoDto implements ICreateDemoDto {
    @IsString()
    public readonly one: string;

    @IsString()
    public readonly two: string;
}

export { CreateDemoDto, ICreateDemoDto }; // eslint-disable-line no-undef
