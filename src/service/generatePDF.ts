import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';
import { getDataFromPostgres } from '../models/dbUtils';
import { RegistroDocument } from '../models/models_puntaciones';

const clearArea = (doc: PDFKit.PDFDocument, startX: number, startY: number, width: number, height: number) => {
  doc.save();
  doc.rect(startX, startY, width, height).clip();
  doc.restore();
};

const drawTable = (
  doc: PDFKit.PDFDocument,
  title: string,
  registros: RegistroDocument[],
  additionalData: any[],
  startY: number
) => {
  const tableTopMargin = 60;
  const tableBottomMargin = 900;
  const tableWidth = 520;
  const columnWidth = tableWidth / 8;
  const headerHeight = 20;
  const rowHeight = 20;
  const tableHeight = headerHeight + registros.length * rowHeight;

  clearArea(doc, 50, startY, tableWidth, tableHeight + tableTopMargin + tableBottomMargin);

  doc.fontSize(14).font('Helvetica-Bold').fillColor('#2E4053').text(`Resultados - ${title}`, { align: 'center' }).moveDown(1);

  const headers = ['N°', 'Nombre', 'Apellido', 'N.Sorteo', 'Intento 1', 'Intento 2', 'Intento 3', 'Mejor'];
  headers.forEach((header, i) => {
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#2E4053').rect(50 + i * columnWidth, startY + tableTopMargin, columnWidth, headerHeight).fill();
    doc.fillColor('white').text(header, 50 + i * columnWidth, startY + tableTopMargin + 5, { align: 'center', width: columnWidth });
  });

  let y = startY + tableTopMargin + headerHeight;
  let numeroConsecutivo = 1;

  registros.forEach((registro, index) => {
    const intentos = registro.intentos.map(i => ({
      peso: i.peso ? i.peso.toString() : '',
      resultado: i.resultado || '',
    }));
    const [intento1 = { peso: '', resultado: '' }, intento2 = { peso: '', resultado: '' }, intento3 = { peso: '', resultado: '' }] = intentos;
    const mejor = Math.max(...registro.intentos.filter(i => i.resultado === 'Éxito').map(i => Number(i.peso)), 0);

    const atleta = additionalData.find(data => data.Id === registro.deportista_id);

    if (atleta) {
      const fillColor = index % 2 === 0 ? '#F0F0F0' : 'white';

      doc.fillColor(fillColor).rect(50, y, tableWidth, rowHeight).fill();
      doc.font('Helvetica').fillColor('#2E4053').fontSize(10)
        .text(numeroConsecutivo.toString(), 50, y + 5, { align: 'center', width: columnWidth })
        .text(atleta.Name, 50 + columnWidth, y + 5, { align: 'center', width: columnWidth })
        .text(atleta.LastName, 50 + 2 * columnWidth, y + 5, { align: 'center', width: columnWidth })
        .text(atleta.Numero_Sorteo, 50 + 3 * columnWidth, y + 5, { align: 'center', width: columnWidth });

      // Add attempts and cross out the failed ones
      const drawAttempt = (attempt: { peso: string, resultado: string }, colIndex: number) => {
        const x = 50 + colIndex * columnWidth;
        const yPos = y + 5;
        const textWidth = doc.widthOfString(attempt.peso);
        const textX = x + (columnWidth - textWidth) / 2;
        const textY = yPos + doc.currentLineHeight() / 2; // Adjusted position

        doc.text(attempt.peso, x, yPos, { align: 'center', width: columnWidth });
        if (attempt.resultado === 'Fallo') {
          doc.moveTo(textX, textY).lineTo(textX + textWidth, textY).stroke();
        }
      };

      drawAttempt(intento1, 4);
      drawAttempt(intento2, 5);
      drawAttempt(intento3, 6);

      doc.text(mejor.toString(), 50 + 7 * columnWidth, y + 5, { align: 'center', width: columnWidth });

      y += rowHeight;
      numeroConsecutivo++;
    }
  });

  return y + tableBottomMargin;
};

export const generarPDFInformeBase64 = async (registrosEnvion: RegistroDocument[], registrosArranque: RegistroDocument[]): Promise<string> => {
  try {
    const additionalData = await getDataFromPostgres();

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      let buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        const base64 = pdfData.toString('base64');
        resolve(base64);
      });
      doc.on('error', (err) => {
        console.error('Error en el documento PDF:', err);
        reject(err);
      });

      doc.image('src/img/logo pesas.png', 30, 20, { width: 100 })
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('INSTITUTO COLOMBIANO DEL DEPORTE - COLDEPORTES', { align: 'right' })
        .moveDown(0.5)
        .text('FEDERACIÓN COLOMBIANA DE LEVANTAMIENTO DE PESAS', { align: 'right' })
        .moveDown(2);

      drawTable(doc, 'Envión', registrosEnvion, additionalData, doc.y);
      doc.addPage();

      const startYArranque = 50;
      drawTable(doc, 'Arranque', registrosArranque, additionalData, startYArranque);

      doc.end();
    });
  } catch (err) {
    console.error('Error al generar el PDF:', err);
    throw err;
  }
};
