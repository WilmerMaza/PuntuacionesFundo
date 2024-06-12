import { Response } from "express";
export interface IClients {
  [key: string]: { [key: string]: Response[] };
}
