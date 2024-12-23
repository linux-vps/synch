import { Injectable } from '@nestjs/common';
import { BitrixConfig, BitrixService } from '../../bitrix.service';
import {
  CompanyAdd,
  CompanyAddResponse,
  CompanyDeleteResponse,
  CompanyFieldsResponse,
  CompanyGetResponse,
  CompanyList,
  CompanyListResponse,
  CompanyUpdate,
  CompanyUpdateResponse
} from '../../../../shared/interfaces/company.interface';
import { BitrixServiceFactory } from '../../bitrix.factory';

/**
 * Dịch vụ quản lý công ty trong Bitrix24.
 */
@Injectable()
export class CompanyService {
  constructor(
    /**
     * Inject BitrixServiceFactory
     */
    private readonly bitrixServiceFactory: BitrixServiceFactory,
  ) {}

  /**
   * Lấy thông tin công ty theo ID.
   * @param id ID của công ty dưới dạng string hoặc number.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Kết quả từ Bitrix24.
   * @throws Lỗi nếu ID không hợp lệ.
   */
  public async get(id: string | number, customerConfig: BitrixConfig): Promise<CompanyGetResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.company.get", { id: numericId });
  }

  /**
   * Lấy danh sách các công ty.
   * @param params Tham số lọc, sắp xếp và chọn trường.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Danh sách các công ty từ Bitrix24.
   */
  public async list(params: CompanyList, customerConfig: BitrixConfig): Promise<CompanyListResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const { order, filter, select } = params;
    return await bitrixService.call("crm.company.list", {
      order,
      filter,
      select,
    });
  }

  /**
   * Thêm công ty mới.
   * @param params Thông tin công ty cần thêm.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Kết quả từ Bitrix24.
   */
  public async add(params: CompanyAdd, customerConfig: BitrixConfig): Promise<CompanyAddResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);

    return await bitrixService.call("crm.company.add", {
      fields: params.fields,
      params: params.params,
    });
  }

  /**
   * Cập nhật thông tin công ty.
   * @param params Thông tin công ty cần cập nhật.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Kết quả từ Bitrix24.
   */
  public async update(params: CompanyUpdate, customerConfig: BitrixConfig): Promise<CompanyUpdateResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(params.id);

    return await bitrixService.call("crm.company.update", {
      id: numericId,
      fields: params.fields,
      params: params.params,
    });
  }

  /**
   * Xóa công ty theo ID.
   * @param id ID của công ty dưới dạng string hoặc number.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Kết quả từ Bitrix24.
   * @throws Lỗi nếu ID không hợp lệ.
   */
  public async delete(id: string | number, customerConfig: BitrixConfig): Promise<CompanyDeleteResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.company.delete", {
      id: numericId,
    });
  }

  /**
   * Lấy các trường thông tin của công ty.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Danh sách các trường thông tin công ty từ Bitrix24.
   */
  public async fields(customerConfig: BitrixConfig): Promise<CompanyFieldsResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    return await bitrixService.call("crm.company.fields");
  }

  /**
   * Chuyển đổi ID từ string sang number và kiểm tra tính hợp lệ.
   * @param id ID của công ty dưới dạng string hoặc number.
   * @returns ID dưới dạng number.
   * @throws Lỗi nếu ID không hợp lệ.
   */
  private parseId(id: string | number): number {
    const numericId: number = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      throw new Error("ID phải là số hợp lệ");
    }

    return numericId;
  }
}
