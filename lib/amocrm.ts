import type { LeadFormValues } from "./validation";

export class AmoCrmNotConfiguredError extends Error {
  constructor() {
    super("amoCRM is not configured (missing AMOCRM_SUBDOMAIN / AMOCRM_ACCESS_TOKEN)");
    this.name = "AmoCrmNotConfiguredError";
  }
}

const ORDERS_LABEL: Record<LeadFormValues["ordersPerDay"], string> = {
  "10_30": "10–30 заказов/день",
  "30_50": "30–50 заказов/день",
  over_50: "более 50 заказов/день",
};

const MODULE_LABEL: Record<LeadFormValues["modules"][number], string> = {
  sales_channels: "Каналы продаж",
  operations: "Операции",
  courier_management: "Управление курьерами",
  crm: "CRM",
  analytics: "Аналитика",
  other: "Другое",
};

function buildNoteText(lead: LeadFormValues): string {
  const modules = lead.modules.map((m) => MODULE_LABEL[m]).join(", ");
  const lines = [
    `Заявка с лендинга Delever (${lead.locale.toUpperCase()})`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Telegram: ${lead.telegram.startsWith("@") ? lead.telegram : `@${lead.telegram}`}`,
    `Заведение: ${lead.restaurantName}`,
    `Заказов в день: ${ORDERS_LABEL[lead.ordersPerDay]}`,
    `Интересующие модули: ${modules}`,
  ];
  if (lead.modules.includes("other") && lead.otherText) {
    lines.push(`Другое (подробности): ${lead.otherText}`);
  }
  return lines.join("\n");
}

async function amoCrmFetch(subdomain: string, token: string, path: string, body: unknown) {
  const res = await fetch(`https://${subdomain}.amocrm.ru${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`amoCRM request to ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Creates a Lead + linked Contact in amoCRM for a landing page submission,
 * then attaches a note with the fields that don't map to standard/known
 * custom field IDs (telegram, restaurant name, orders/day, modules) since
 * those custom field IDs are account-specific and unknown at scaffold time.
 */
export async function createAmoCrmLead(lead: LeadFormValues): Promise<{ leadId: number }> {
  const subdomain = process.env.AMOCRM_SUBDOMAIN;
  const token = process.env.AMOCRM_ACCESS_TOKEN;

  if (!subdomain || !token) {
    throw new AmoCrmNotConfiguredError();
  }

  const pipelineId = process.env.AMOCRM_PIPELINE_ID
    ? Number(process.env.AMOCRM_PIPELINE_ID)
    : undefined;
  const statusId = process.env.AMOCRM_STATUS_ID
    ? Number(process.env.AMOCRM_STATUS_ID)
    : undefined;

  const complexPayload = [
    {
      name: `${lead.restaurantName} — заявка с сайта`,
      ...(pipelineId ? { pipeline_id: pipelineId } : {}),
      ...(statusId ? { status_id: statusId } : {}),
      _embedded: {
        contacts: [
          {
            first_name: lead.name,
            custom_fields_values: [
              {
                field_code: "PHONE",
                values: [{ value: lead.phone, enum_code: "WORK" }],
              },
            ],
          },
        ],
      },
    },
  ];

  const created = await amoCrmFetch(subdomain, token, "/api/v4/leads/complex", complexPayload);
  const leadId: number | undefined = created?.[0]?.id;

  if (!leadId) {
    throw new Error("amoCRM did not return a lead id");
  }

  await amoCrmFetch(subdomain, token, "/api/v4/leads/notes", [
    {
      entity_id: leadId,
      note_type: "common",
      params: { text: buildNoteText(lead) },
    },
  ]);

  return { leadId };
}
