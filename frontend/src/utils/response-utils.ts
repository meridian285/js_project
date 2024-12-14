import {HttpUtils} from "./http-utils";
import {GET, OPERATIONS} from "../../config/config";

export class ResponseUtils {

    static async getOperations() {
        const response = await HttpUtils.request(OPERATIONS, GET, true)

        console.log(response)
    }
}