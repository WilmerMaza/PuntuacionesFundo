import { Response } from "express";
import { IClients } from "../models/IClients";
import { RequestEventData } from "../models/RequestEventData";


export class eventoService {
  private static clients: IClients = {};

  public static addClient(partidaId: string, client: Response, platform: string) {
    // Asegurarse de que los headers son adecuados para SSE
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

    // Manejar correctamente el cierre de la conexión
    // Manejar correctamente el cierre de la conexión
    client.on("close", () => {
      this.clients[partidaId][platform] = this.clients[partidaId][platform].filter(
        (c) => c !== client
      );
      if (this.clients[partidaId][platform].length === 0) {
        delete this.clients[partidaId][platform];
      }
      // Si todas las plataformas están vacías, eliminar la partidaId
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
