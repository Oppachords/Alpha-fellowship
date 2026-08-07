function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0">${value}</td></tr>`;
}

function wrap(title: string, rows: string) {
  return `
    <h2 style="font-family:Georgia,serif;color:#181D38">${title}</h2>
    <table style="font-family:sans-serif;font-size:14px;line-height:1.5">${rows}</table>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:24px">
      Sent from the Alpha Fellowship Uganda website.
    </p>
  `;
}

export function contactMessageEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}) {
  return wrap(
    "New contact message",
    [
      row("Name", data.name),
      row("Email", data.email),
      row("Phone", data.phone),
      row("Message", data.message.replace(/\n/g, "<br>")),
    ].join("")
  );
}

export function prayerRequestEmail(data: {
  name: string;
  email: string;
  category: string;
  request: string;
}) {
  return wrap(
    "New prayer request",
    [
      row("Name", data.name),
      row("Email", data.email),
      row("Category", data.category),
      row("Request", data.request.replace(/\n/g, "<br>")),
    ].join("")
  );
}

export function counsellingRequestEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
}) {
  return wrap(
    "New counselling request",
    [
      row("Name", data.name),
      row("Email", data.email),
      row("Phone", data.phone),
      row("Message", data.message?.replace(/\n/g, "<br>")),
    ].join("")
  );
}

export function paymentConfirmationEmail(data: {
  name: string;
  email: string;
  paymentMethod: string;
  referenceNumber: string;
  amount?: string | null;
}) {
  return wrap(
    "New payment confirmation",
    [
      row("Name", data.name),
      row("Email", data.email),
      row("Method", data.paymentMethod),
      row("Amount", data.amount ? `UGX ${data.amount}` : null),
      row("Reference", data.referenceNumber),
    ].join("")
  );
}

export function memberRegistrationEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
}) {
  return wrap(
    "New member registration",
    [
      row("Name", data.name),
      row("Email", data.email),
      row("Phone", data.phone),
      row("Status", "Pending admin approval"),
    ].join("")
  );
}
