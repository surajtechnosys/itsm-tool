export function purchaseOrderTemplate({
  vendorName,
  poNumber,
  poDate,
  totalAmount,
  deliveryDate,
}: {
  vendorName: string;
  poNumber: string;
  poDate: string;
  totalAmount: number;
  deliveryDate: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #1a73e8;">Purchase Order Confirmation</h2>

    <p>Dear ${vendorName},</p>

    <p>
      We are pleased to inform you that your quotation has been approved.
      Please find the purchase order details below:
    </p>

    <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <tr>
        <td><strong>PO Number:</strong></td>
        <td>${poNumber}</td>
      </tr>
      <tr>
        <td><strong>PO Date:</strong></td>
        <td>${poDate}</td>
      </tr>
      <tr>
        <td><strong>Total Amount:</strong></td>
        <td>₹ ${totalAmount}</td>
      </tr>
      <tr>
        <td><strong>Delivery Date:</strong></td>
        <td>${deliveryDate}</td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      Kindly proceed with production and confirm the dispatch schedule.
    </p>

    <p>
      Please ensure all invoices and delivery documents mention the PO number
      for smooth processing.
    </p>

    <br/>
    <p>
      Best Regards,<br/>
      Procurement Department<br/>
      Asset Management System 
    </p>
  </div>
  `;
}
