import { IHttpResp } from '../http/http.resp.interface';

export interface IErrorRespBody extends IHttpResp {
	success: boolean;
	err: string;
}
