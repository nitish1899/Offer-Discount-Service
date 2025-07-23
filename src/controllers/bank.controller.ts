import { Request, Response } from "express";
import { BankService } from "../services/bank.service";


export const createBank = async (req: Request, res: Response) => {
  const service = new BankService(req.orm);
  const bank = await service.createBank(req.body);
  res.status(201).json({ message: "Bank created", data: bank });
};

export const getAllBanks = async (req: Request, res: Response) => {
  const service = new BankService(req.orm);
  const banks = await service.getAllBanks();
  res.json({ data: banks });
};

export const getBankById = async (req: Request, res: Response) => {
  const service = new BankService(req.orm);
  const bank = await service.getBankById(req.params.id);
  if (!bank) return res.status(404).json({ message: "Not found" });
  res.json({ data: bank });
};

export const updateBank = async (req: Request, res: Response) => {
  const service = new BankService(req.orm);
  const bank = await service.updateBank(req.params.id, req.body);
  if (!bank) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated", data: bank });
};

export const deleteBank = async (req: Request, res: Response) => {
  const service = new BankService(req.orm);
  const result = await service.deleteBank(req.params.id);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
