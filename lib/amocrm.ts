import type { LeadFormValues } from "./validation";

export class AmoCrmNotConfiguredError extends Error {
  constructor() {
    super("amoCRM is not configured (missing AMOCRM_SUBDOMAIN / AMOCRM_ACCESS_TOKEN)");
    this.name = "AmoCrmNotConfiguredError";
  }
}

const BRANCHES_LABEL: Record<LeadFormValues["branches"], string> = {
  "1": "1",
  "2_3": "2–3",
  "4_10": "4–10",
  over_10: "10+",
};

const POS_LABEL: Record<LeadFormValues["pos"], string> = {
  iiko: "iiko",
  clopos: "Clopos",
  alisa: "Alisa",
  poster: "Poster",
  rkeeper: "R-Keeper",
  jowi: "Jowi",
  none: "Нет POS-системы",
};

const ORDERS_LABEL: Record<LeadFormValues["ordersPerDay"], string> = {
  "1_20": "1–20 заказов/день",
  "20_50": "20–50 заказов/день",
  "50_100": "50–100 заказов/день",
  over_100: "более 100 заказов/день",
};

const AGGREGATOR_LABEL: Record<LeadFormValues["aggregators"][number], string> = {
  uzum_tezkor: "Uzum Tezkor",
  yandex: "Yandex",
  other: "Другие",
  none: "Не работает с агрегаторами",
};

const MODULE_LABEL: Record<LeadFormValues["modules"][number], string> = {
  sales_channels: "Нет Telegram-бота или сайта",
  operations: "Хочет получать заказы Yandex и Uzum в виде чека",
  courier_management: "Управление курьерами",
  crm: "Приём заказов занимает много времени",
  analytics: "Аналитика",
  other: "Другое",
};

function buildNoteText(lead: LeadFormValues): string {
  const lines = [
    `Заявка с лендинга Delever (${lead.locale.toUpperCase()})`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
  ];
  if (lead.telegram) {
    lines.push(`Telegram: ${lead.telegram.startsWith("@") ? lead.telegram : `@${lead.telegram}`}`);
  }
  lines.push(
    `Бизнес: ${lead.restaurantName}`,
    `Расположение: ${lead.planning ? "Пока только планирует открытие" : lead.location}`,
    `Филиалов: ${BRANCHES_LABEL[lead.branches]}`,
    `POS-система: ${POS_LABEL[lead.pos]}`,
    `Доставка: ${ORDERS_LABEL[lead.ordersPerDay]}`,
    `Агрегаторы: ${lead.aggregators.map((a) => AGGREGATOR_LABEL[a]).join(", ")}`,
    `Как устроена доставка: ${lead.deliverySystem}`,
    `Проблемы с доставкой: ${lead.modules.map((m) => MODULE_LABEL[m]).join(", ")}`,
  );
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
 * then attaches a note with all quiz answers (telegram, business, location,
 * branches, POS, orders/day, aggregators, delivery setup, problems) since
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
