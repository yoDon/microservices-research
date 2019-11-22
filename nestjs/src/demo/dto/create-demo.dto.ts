import { ApiModelProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

interface ICreateDemoDto {
    readonly one: string;
    readonly two: string;
}

class CreateDemoDto implements ICreateDemoDto {
    @ApiModelProperty({ type: String })
    @IsString()
    public readonly one: string;

    @ApiModelProperty({ type: String })
    @IsString()
    public readonly two: string;
}

export { CreateDemoDto, ICreateDemoDto }; // eslint-disable-line no-undef