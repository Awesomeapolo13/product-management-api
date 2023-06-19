import { HttpRespInterface } from '../http/http.resp.interface';

export interface ErrorRespBodyInterface extends HttpRespInterface {
	success: boolean;
	err: string;
}
