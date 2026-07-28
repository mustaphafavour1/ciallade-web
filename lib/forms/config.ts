/**
 * Google Form targets, wired directly (no prefill-URL / sentinel step).
 *
 * Each `fields` map is our internal field key → the Google Form's `entry.<id>`
 * number, read straight from the form's pre-filled link. Submissions POST to
 *   https://docs.google.com/forms/d/e/<id>/formResponse
 *
 * A Google Form's response endpoint is inherently public (that is how it
 * receives answers), so nothing secret lives here. To point at a different
 * form later, replace the id and re-map the entry numbers from its new
 * pre-filled link.
 */

export type FormConfig = {
  id: string;
  fields: Record<string, string>;
};

// "Ciallade — Orders"
export const ORDER_FORM: FormConfig = {
  id: '1FAIpQLSfGVj_ChTD0Cf2LuGizE_HZ1vm85WR1Q5fnoxdcbTTYOafiDA',
  fields: {
    name: '1166351754',
    email: '1243210252',
    phone: '782888631',
    altPhone: '143091864',
    address: '1089372363',
    piece: '33247708',
    size: '721169109',
    unitPrice: '1406538747',
    qty: '1698276630',
    total: '1065717689',
    reference: '1737553880',
    status: '1480841231',
    notes: '1502738881',
  },
};

// "Ciallade — Enquiries"
export const ENQUIRY_FORM: FormConfig = {
  id: '1FAIpQLSdAoNrNNZYOYF7OjjotPXjV5BTYWocb_Q8z1QlJDytSAbStGQ',
  fields: {
    name: '464554929',
    email: '1887410302',
    phone: '1681660985',
    piece: '506840639',
    message: '1027880267',
  },
};
