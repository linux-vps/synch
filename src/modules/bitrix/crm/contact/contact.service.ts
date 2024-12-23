import { Injectable, Logger } from '@nestjs/common';
import { BitrixConfig, BitrixService } from '../../bitrix.service';
import { ContactAdd, ContactAddResponse, ContactDeleteResponse, ContactFieldsResponse, ContactGetResponse, ContactList, ContactListResponse, ContactUpdate, ContactUpdateResponse } from '../../../../shared/interfaces/contact.interface';
import { ContactCompanyService } from './contact-company.service';
import { BitrixServiceFactory } from '../../bitrix.factory';

/**
 * Dịch vụ quản lý liên hệ trong Bitrix24.
 */
@Injectable()
export class ContactService {
  private readonly logger: Logger = new Logger(ContactService.name);

  constructor(
    /**
     * Inject BitrixServiceFactory
     */
    private readonly bitrixServiceFactory: BitrixServiceFactory,

    /**
     * Inject ContactCompanyService
     */
    private readonly contactCompanyService: ContactCompanyService
  ) {}

  /**
   * Lấy thông tin liên hệ theo ID.
   * @param id ID của liên hệ dưới dạng string hoặc number.
   * @param customerConfig Cấu hình của khách hàng.
   * @returns Kết quả từ Bitrix24.
   * @throws Lỗi nếu ID không hợp lệ.
   */
  public async get(id: string | number, customerConfig: BitrixConfig): Promise<ContactGetResponse> {
    this.logger.log(`Lấy thông tin liên hệ với ID: ${id}`);
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.get", { id: numericId });
  }

  /**
   * Lấy danh sách các liên hệ.
   * @param params Tham số lọc, sắp xếp và chọn trường.
   * @returns Danh sách các liên hệ từ Bitrix24.
   */
  public async list(params: ContactList, customerConfig: BitrixConfig): Promise<ContactListResponse> {
    this.logger.log('Lấy danh sách liên hệ');
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const { order, filter, select } = params;
    return await bitrixService.call("crm.contact.list", {
      order,
      filter,
      select,
    });
  }

  /**
   * Thêm liên hệ mới.
   * @param params Thông tin liên hệ cần thêm.
   * @returns Kết quả từ Bitrix24.
   */
  public async add(
    { fields, params }: ContactAdd, 
    customerConfig: BitrixConfig
  ): Promise<ContactAddResponse> {
    this.logger.log(`Thêm liên hệ mới với dữ liệu: ${JSON.stringify(fields)}`);
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);

    return await bitrixService.call("crm.contact.add", {
      fields,
      params,
    });
  }

  /**
   * Cập nhật thông tin liên hệ.
   * @param params Thông tin liên hệ cần cập nhật.
   * @returns Kết quả từ Bitrix24.
   */
  public async update(
    { id, fields }: ContactUpdate, 
    customerConfig: BitrixConfig
  ): Promise<ContactUpdateResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);

    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.update", {
      id: numericId,
      fields,
    });
  }

  /**
   * Xóa liên hệ theo ID.
   * @param id ID của liên hệ dưới dạng string hoặc number.
   * @returns Kết quả từ Bitrix24.
   * @throws Lỗi nếu ID không hợp lệ.
   */
  public async delete(id: string | number, customerConfig: BitrixConfig): Promise<ContactDeleteResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.delete", {
      id: numericId,
    });
  }

  /**
   * Lấy các trường liên hệ.
   * @returns Danh sách các trường liên hệ từ Bitrix24.
   */
  public async fields(customerConfig: BitrixConfig): Promise<ContactFieldsResponse> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    return await bitrixService.call("crm.contact.fields");
  }

  /**
   * Chuyển đổi ID từ string sang number và kiểm tra tính hợp lệ.
   * @param id ID dưới dạng string hoặc number.
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
