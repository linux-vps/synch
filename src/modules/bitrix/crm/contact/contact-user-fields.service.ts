import { Injectable } from '@nestjs/common';
import { BitrixConfig, BitrixService } from '../../bitrix.service';
import {
  UserFieldAdd,
  UserFieldList,
  UserFieldUpdate,
} from '../../../../shared/interfaces/user-fields.interface';
import { BitrixServiceFactory } from '../../bitrix.factory';

/**
 * Dịch vụ quản lý các trường người dùng liên hệ trong Bitrix24.
 */
@Injectable()
export class ContactUserFiledsService {
  constructor(
    /**
     * Inject BitrixServiceFactory
     */
    private readonly bitrixServiceFactory: BitrixServiceFactory,  
  ) {}

  /**
   * Lấy thông tin trường người dùng theo ID.
   * @param id ID của trường người dùng dưới dạng string hoặc number.
   * @returns Kết quả từ Bitrix24.
   * @throws Lỗi nếu ID không hợp lệ.
   */
  public async get(id: string | number, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.userfield.get", {
      id: numericId,
    });
  }

  /**
   * Lấy danh sách các trường người dùng.
   * @param params Tham số lọc, sắp xếp và bắt đầu.
   * @returns Danh sách các trường người dùng từ Bitrix24.
   */
  public async list(params: UserFieldList, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const { order, filter, START } = params;
    return await bitrixService.call("crm.contact.userfield.list", {
      order,
      filter,
      START,
    });
  }

  /**
   * Thêm trường người dùng mới.
   * @param params Thông tin trường người dùng cần thêm.
   * @returns Kết quả từ Bitrix24.
   */
  public async add(params: UserFieldAdd, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const { fields, LIST } = params;
    return await bitrixService.call("crm.contact.userfield.add", {
      fields,
      LIST,
    });
  }

  /**
   * Cập nhật thông tin trường người dùng.
   * @param params Thông tin trường người dùng cần cập nhật.
   * @returns Kết quả từ Bitrix24.
   */
  public async update(params: UserFieldUpdate, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const { id, fields, LIST } = params;
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.userfield.update", {
      id: numericId,
      fields,
      LIST,
    });
  }

  /**
   * Xóa trường người dùng theo ID.
   * @param id ID của trường người dùng dưới dạng string hoặc number.
   * @returns Kết quả từ Bitrix24.
   */
  public async delete(id: string | number, customerConfig: BitrixConfig ) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.userfield.delete", {
      id: numericId,
    });
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
