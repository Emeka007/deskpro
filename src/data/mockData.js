export const AGENTS = [
  { id: 'a1', name: 'Sarah Chen',    initials: 'SC', color: '#E6F1FB', textColor: '#0C447C', resolved: 14 },
  { id: 'a2', name: 'Marcus Torres', initials: 'MT', color: '#EAF3DE', textColor: '#27500A', resolved: 11 },
  { id: 'a3', name: 'Priya Kapoor',  initials: 'PK', color: '#EEEDFE', textColor: '#3C3489', resolved: 9  },
  { id: 'a4', name: 'James Okafor',  initials: 'JO', color: '#FAEEDA', textColor: '#633806', resolved: 7  },
];

export const CATEGORIES = ['Billing', 'Technical', 'Account', 'Feature Request', 'Other'];

export const STATUSES = ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'];

export const PRIORITIES = ['P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'];

const TITLES = [
  'Cannot access account after password reset',
  'Invoice shows incorrect amount for last month',
  'API rate limit hit unexpectedly in production',
  'Feature request: bulk export to CSV',
  'Dashboard loading very slowly on mobile devices',
  'Webhook not triggering on order completion event',
  'Wrong VAT applied on EU invoices',
  'SSO login fails with Google Workspace accounts',
  'Missing data in the exported monthly report',
  'Billing charged twice in November statement',
  'Need to add a new team member to the workspace',
  'Two-factor authentication not working with Authy',
  'Custom domain not resolving after DNS update',
  'Request for white-label branding options',
  'Data retention policy questions for GDPR compliance',
  'Integration with Salesforce breaks during sync',
  'Email notifications not being received by users',
  'Search returns no results for known entries',
  'Need to downgrade subscription plan to starter',
  'Response times very slow in Asia-Pacific region',
  'Cannot upload files larger than 5MB',
  'Dark mode setting not persisting between sessions',
  'API documentation link returns 404 error',
  'Duplicate transactions appearing in billing history',
  'Password policy enforcement not working correctly',
  'User permissions not applying after role change',
  'Mobile app crashing on iOS 17 devices',
  'Unable to delete archived project',
  'Scheduled reports not being sent via email',
  'Integration with Zapier producing errors',
  'Cannot add custom fields to contact records',
  'Audit log missing entries for admin actions',
  'Chart visualisations not rendering in Safari',
  'CSV import failing silently with no error message',
  'Timezone setting ignored in scheduled jobs',
  'Feature request: keyboard shortcuts for power users',
  'Subscription renewal failed despite valid card',
  'Sub-accounts not inheriting parent settings',
  'API token expiring too quickly',
  'Onboarding checklist stuck at 80% completion',
  'Cannot invite users with plus-addressed emails',
  'Pagination breaks when filtering by date range',
  'Notification centre showing stale read items',
  'Two workspaces merging incorrectly after migration',
  'Cannot change the primary account email address',
  'Feature request: activity feed for team events',
  'Billing portal inaccessible after plan change',
  'Data export job timing out for large datasets',
  'Support chat widget not loading on Firefox',
  'Workflow automation triggering duplicate actions',
];

const REQUESTERS = [
  'alice@acme.com', 'bob@startup.io', 'carol@enterprise.net',
  'dave@agency.com', 'eve@techfirm.dev', 'frank@bigco.com',
  'grace@consult.biz', 'harry@digital.co',
];

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rnd(0, arr.length - 1)];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export const generateTickets = () =>
  TITLES.map((title, i) => {
    const created = daysAgo(rnd(0, 29));
    const agent = AGENTS[i % AGENTS.length];
    const status = pick(STATUSES);
    const updated = new Date(created.getTime() + rnd(1, 72) * 3600000);

    return {
      id: `TKT-${1000 + i}`,
      title,
      requester: REQUESTERS[i % REQUESTERS.length],
      status,
      priority: PRIORITIES[i % PRIORITIES.length],
      category: CATEGORIES[i % CATEGORIES.length],
      agent,
      created: created.toISOString(),
      updated: updated.toISOString(),
      comments: rnd(0, 8),
      description: `The user reports: "${title.toLowerCase()}". This issue was flagged as affecting their workflow. Standard troubleshooting steps have been attempted without resolution. Customer is requesting urgent assistance.`,
      timeline: [
        { type: 'created',  text: `Ticket created by ${REQUESTERS[i % REQUESTERS.length]}`, time: created.toISOString() },
        { type: 'assigned', text: `Assigned to ${agent.name}`,                               time: new Date(created.getTime() + 900000).toISOString() },
        ...(status !== 'Open' ? [{ type: 'status', text: `Status changed to ${status}`, time: updated.toISOString() }] : []),
      ],
    };
  });
