import { EntityManager } from "@mikro-orm/core";
import { Bank } from "../entities/bank.entity";

export class BankService {
  constructor(private readonly em: EntityManager) {}

  async createBank(data: Partial<Bank>) {
    if (!data.name || typeof data.name !== "string") {
      throw new Error("Bank 'name' is required and must be a string.");
    }
    const bank = new Bank({
      name: data.name,
      ifsc_code: data.ifsc_code,
      logo_url: data.logo_url,
    });
    await this.em.persistAndFlush(bank);
    return bank;
  }

  async getAllBanks() {
    return this.em.find(Bank, {});
  }

  async getBankById(id: string) {
    return this.em.findOne(Bank, { id });
  }

  async updateBank(id: string, data: Partial<Bank>) {
    const bank = await this.getBankById(id);
    if (!bank) return null;
    this.em.assign(bank, data);
    await this.em.persistAndFlush(bank);
    return bank;
  }

  async deleteBank(id: string) {
    const bank = await this.getBankById(id);
    if (!bank) return null;
    await this.em.removeAndFlush(bank);
    return true;
  }
}
