import { generateTickets, AGENTS, PRIORITIES, CATEGORIES } from '../data/mockData';

// In-memory store (replace with real fetch() calls against a .NET API)
let DB = generateTickets();
let nextId = 1050;

const delay = (ms = 350) => new Promise(res => setTimeout(res, ms));

async function withRetry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) return withRetry(fn, retries - 1);
    throw err;
  }
}

export async function fetchAllTickets() {
  return withRetry(async () => {
    await delay();
    return [...DB];
  });
}

export async function fetchTicketById(id) {
  return withRetry(async () => {
    await delay(200);
    const ticket = DB.find(t => t.id === id);
    if (!ticket) throw new Error(`Ticket ${id} not found`);
    return { ...ticket };
  });
}

export async function updateTicketStatus(id, status) {
  return withRetry(async () => {
    await delay(300);
    const idx = DB.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Ticket ${id} not found`);
    const now = new Date().toISOString();
    DB[idx] = {
      ...DB[idx],
      status,
      updated: now,
      timeline: [
        ...DB[idx].timeline,
        { type: 'status', text: `Status changed to ${status}`, time: now },
      ],
    };
    return { ...DB[idx] };
  });
}

export async function reassignTicket(id, agentId) {
  return withRetry(async () => {
    await delay(300);
    const idx = DB.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Ticket ${id} not found`);
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);
    const now = new Date().toISOString();
    DB[idx] = {
      ...DB[idx],
      agent,
      updated: now,
      timeline: [
        ...DB[idx].timeline,
        { type: 'assigned', text: `Reassigned to ${agent.name}`, time: now },
      ],
    };
    return { ...DB[idx] };
  });
}

export async function createNewTicket(formData) {
  return withRetry(async () => {
    await delay(500);
    const now = new Date().toISOString();
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const newTicket = {
      id:          `TKT-${nextId++}`,
      title:       formData.title,
      requester:   formData.requester,
      description: formData.description || '',
      status:      'Open',
      priority:    formData.priority    || 'P3 - Medium',
      category:    formData.category    || 'Other',
      agent,
      created:     now,
      updated:     now,
      comments:    0,
      timeline:    [
        { type: 'created',  text: `Ticket created by ${formData.requester}`, time: now },
        { type: 'assigned', text: `Auto-assigned to ${agent.name}`,          time: now },
      ],
    };
    DB.unshift(newTicket);
    return { ...newTicket };
  });
}

export async function addComment(id, text) {
  return withRetry(async () => {
    await delay(250);
    const idx = DB.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Ticket ${id} not found`);
    const now = new Date().toISOString();
    DB[idx] = {
      ...DB[idx],
      comments: DB[idx].comments + 1,
      updated:  now,
      timeline: [
        ...DB[idx].timeline,
        { type: 'comment', text: `Agent note: ${text}`, time: now },
      ],
    };
    return { ...DB[idx] };
  });
}
