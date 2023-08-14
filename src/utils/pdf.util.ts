import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ITicket } from '../modules/ticket/ticket.schema';

export class PdfAttachmentUtil {
  static async exportTicketReport(tickets: ITicket[]) {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'cm',
      format: 'a4',
    });
    const pdfHead = [
      'Attendee name',
      'Email',
      'Attendee Checkin Status',
      'Attendee Total Possible checkins',
    ];
    const pdfBody = [];
    tickets.forEach((ticket) => {
      const subject = ticket.subject as string;
      const status = ticket.status as string;
      const createdAt = ticket.createdAt as string;
      pdfBody.push([subject, status, createdAt]);
    });

    autoTable(pdf, {
      head: [pdfHead],
      body: pdfBody,
    });

    const pdfOutput = pdf.output('datauristring');
    const formattedBase64String = pdfOutput.replace(
      'data:application/pdf;filename=generated.pdf;base64,',
      '',
    );

    return formattedBase64String;
  }
}
