import { AppConstatnts } from './app-constants';
export class AppResponse<T> {
  code: number;
  data: T;
  message: AppConstatnts;
  constructor(code: number, data: T, message: AppConstatnts) {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}
