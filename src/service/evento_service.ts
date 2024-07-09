import { Response } from "express";
import { IClients } from "../models/IClients";
import { RequestEventData } from "../models/RequestEventData";


export class eventoService {
  private static clients: IClients = {};

  public static addClient(partidaId: string, client: Response, platform: string) {
    client.setHeader("Content-Type", "text/event-stream");
    client.setHeader("Cache-Control", "no-cache");
    client.setHeader("Connection", "keep-alive");

    if (!this.clients[partidaId]) {
      this.clients[partidaId] = {};
    }
    if (!this.clients[partidaId][platform]) {
      this.clients[partidaId][platform] = [];
    }
    this.clients[partidaId][platform].push(client);

    
    client.on("close", () => {
      this.clients[partidaId][platform] = this.clients[partidaId][platform].filter(
        (c) => c !== client
      );
      if (this.clients[partidaId][platform].length === 0) {
        delete this.clients[partidaId][platform];
      }
      
      if (Object.keys(this.clients[partidaId]).length === 0) {
        delete this.clients[partidaId];
      }
      client.end();
    });
  }

  public static actionEvento(
    { event, partidaId, platform, body }: RequestEventData
  ): void {

    console.log(
      `Cronómetro ${event} para la competición: ${partidaId}`
    );

    const data = `data: ${JSON.stringify({
      action: event,
      time: new Date().toISOString(),
      body
    })}\n\n`;
    if (this.clients[partidaId] && this.clients[partidaId][platform]) {
      this.clients[partidaId][platform].forEach((client) => {
        client.write(data);
      });
    }
  }
}
