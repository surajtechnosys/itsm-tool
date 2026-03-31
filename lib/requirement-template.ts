type ConfigItem = {
  item: string;
  quantity?: string;
  description?: string;
};

type RequirementPayload = {
  manufatured: string;
  model: string;
  warranty: string;
  warrantyType?: string;
  quotationValidity: string | Date;
  notes?: string;
  configuration: ConfigItem[];
  vendorName: string;
  vendorId: string;
  requirementId: string;

};

export function requirementEmailTemplate(data: RequirementPayload) {
  const specs = data.configuration
    .map(
      (c) => `
        <tr>
          <td style="border:1px solid #ddd; padding:6px;">${c.item}</td>
          <td style="border:1px solid #ddd; padding:6px;">${c.quantity || "-"}</td>
          <td style="border:1px solid #ddd; padding:6px;">${c.description || "-"}</td>
        </tr>
      `
    )
    .join("");

  // ✅ Vendor quotation form link
  const vendorFormLink = `${process.env.NEXT_PUBLIC_APP_URL}/vender-request/${data.requirementId}/${data.vendorId}`;
    // const vendorFormLink =
  // `${process.env.NEXT_PUBLIC_APP_URL}/vender-request?rid=${data.requirementId}&vid=${data.vendorId}`;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

  <table width="600" align="center" style="background:#ffffff; padding:24px; border-radius:6px;">
    
    <tr>
      <td style="font-size:20px; font-weight:bold;">
        Asset Request – Quotation Required
      </td>
    </tr>

    <tr>
      <td style="padding-top:16px;">
        Dear <strong>${data.vendorName}</strong>,
      </td>
    </tr>

    <tr>
      <td style="padding-top:12px;">
        We would like to request a quotation for the following asset(s).
      </td>
    </tr>

    <!-- BASIC DETAILS -->
    <tr>
      <td style="padding-top:16px;">
        <strong>Asset Details</strong>
        <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-top:8px;">
          <tr>
            <td><strong>Manufacturer</strong></td>
            <td>${data.manufatured}</td>
          </tr>
          <tr>
            <td><strong>Model</strong></td>
            <td>${data.model}</td>
          </tr>
          <tr>
            <td><strong>Warranty</strong></td>
            <td>${data.warranty}</td>
          </tr>
          <tr>
            <td><strong>Warranty Type</strong></td>
            <td>${data.warrantyType || "-"}</td>
          </tr>
          <tr>
            <td><strong>Quotation Validity</strong></td>
            <td>${new Date(data.quotationValidity).toDateString()}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CONFIGURATION TABLE -->
    <tr>
      <td style="padding-top:16px;">
        <strong>Configuration</strong>
        <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-top:8px;">
          <tr>
            <th style="border:1px solid #ddd;">Item</th>
            <th style="border:1px solid #ddd;">Quantity</th>
            <th style="border:1px solid #ddd;">Description</th>
          </tr>
          ${specs}
        </table>
      </td>
    </tr>

    <!-- NOTES -->
    <tr>
      <td style="padding-top:16px;">
        <strong>Additional Notes</strong><br/>
        ${data.notes || "N/A"}
      </td>
    </tr>

    <!-- CTA BUTTON -->
    <tr>
      <td style="padding-top:24px; text-align:center;">
        <a
          href="${vendorFormLink}"
          target="_blank"
          style="
            display:inline-block;
            padding:12px 20px;
            background-color:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:4px;
            font-weight:bold;
          "
        >
          Submit Your Quotation
        </a>
      </td>
    </tr>

    <!-- FALLBACK LINK -->
    <tr>
      <td style="padding-top:12px; font-size:12px; color:#555; text-align:center;">
        Or copy and paste this link into your browser:<br/>
        <a href="${vendorFormLink}">${vendorFormLink}</a>
      </td>
    </tr>

    <tr>
      <td style="padding-top:24px;">
        Best regards,<br/>
        <strong>Asset Management Team</strong>
      </td>
    </tr>

  </table>

</body>
</html>
`;
}
