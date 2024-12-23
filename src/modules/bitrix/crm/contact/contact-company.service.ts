import { Injectable } from '@nestjs/common';
import { BitrixConfig, BitrixService } from '../../bitrix.service';
import { 
    ContactCompanyFields, 
    ContactCompanyItems, 
    ContactCompanySet, 
    AddCompanyToContact, 
    RemoveCompanyFromContact 
} from '../../../../shared/interfaces/contact-company.interface';
import { BitrixServiceFactory } from '../../bitrix.factory';

/**
 * Dịch vụ quản lý liên kết công ty với liên hệ trong Bitrix24.
 */
@Injectable()
export class ContactCompanyService {
  constructor(
    /**
     * Inject BitrixServiceFactory
     */
    private readonly bitrixServiceFactory: BitrixServiceFactory,
  ) {}

  /**
   * Xóa liên kết công ty khỏi liên hệ.
   * @param params Thông tin liên hệ và trường cần xóa.
   * @returns Kết quả từ Bitrix24.
   */
  public async remove(params: RemoveCompanyFromContact, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const id: number = this.parseId(params.id);

    return await bitrixService.call("crm.contact.company.delete", {
      id: id,
      fields: params.fields,
    });
  }

  /**
   * Thêm liên kết công ty vào liên hệ.
   * @param params Thông tin liên hệ và trường cần thêm.
   * @returns Kết quả từ Bitrix24.
   */
  public async add(params: AddCompanyToContact, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const id: number = this.parseId(params.id);

    return await bitrixService.call("crm.contact.company.add", {
      id: id,
      fields: params.fields,
    });
  }

  /**
   * Lấy thông tin các trường liên kết công ty.
   * @returns Danh sách các trường liên kết công ty.
   */
  public async fields(customerConfig: BitrixConfig): Promise<ContactCompanyFields> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    return await bitrixService.call("crm.contact.company.fields");
  }

  /**
   * Xóa tất cả các liên kết công ty khỏi liên hệ.
   * @param id ID của liên hệ.
   * @returns Kết quả từ Bitrix24.
   */
  public async clearCompanies(id: string | number, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.company.items.delete", { id: numericId });
  }

  /**
   * Lấy các liên kết công ty của liên hệ.
   * @param id ID của liên hệ.
   * @returns Danh sách các liên kết công ty.
   */
  public async getContact(id: string | number, customerConfig: BitrixConfig): Promise<ContactCompanyItems> {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(id);

    return await bitrixService.call("crm.contact.company.items.get", { id: numericId });
  }

  /**
   * Thiết lập các liên kết công ty cho liên hệ.
   * @param params Thông tin liên hệ và các liên kết công ty cần thiết lập.
   * @returns Kết quả từ Bitrix24.
   */
  public async setCompanies(params: ContactCompanySet, customerConfig: BitrixConfig) {
    const bitrixService = this.bitrixServiceFactory.createService(customerConfig);
    const numericId: number = this.parseId(params.id);

    return await bitrixService.call("crm.contact.company.items.set", {
      id: numericId,
      items: params.items,
    });
  }

  /**
   * Chuyển đổi ID từ string sang number và kiểm tra tính hợp lệ.
   * @param id ID của liên hệ dưới dạng string hoặc number.
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
