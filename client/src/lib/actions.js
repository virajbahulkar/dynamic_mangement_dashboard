// Minimal action runner scaffold
// Actions: [{ type: 'toast'|'log'|'save', message?, level?, pageId?, data? }]

export async function runActions(actions = [], ctx = {}) {
  for (const a of actions) {
    try {
      if (!a || typeof a !== 'object') continue;
      switch (a.type) {
        case 'toast': {
          const msg = renderTemplate(a.message || '', ctx);
          if (typeof window !== 'undefined') {
            // Simple toast fallback: alert; replace with your toast library
            // eslint-disable-next-line no-alert
            alert(msg);
          } else {
            // eslint-disable-next-line no-console
            console.log('[toast]', msg);
          }
          break;
        }
        case 'log': {
          // eslint-disable-next-line no-console
          console[a.level || 'log'](renderTemplate(a.message || '', ctx));
          break;
        }
        case 'save': {
          // Save data to DB, e.g., page or form data
          const pageId = a.pageId || ctx.pageId || 'draft';
          const data = a.data || ctx.data || ctx.value;
          try {
            const response = await fetch(`/db/pages/${encodeURIComponent(pageId)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: pageId, data }),
            });
            if (!response.ok) throw new Error(`Save failed: ${response.status}`);
            const msg = renderTemplate(a.message || 'Saved successfully', ctx);
            // eslint-disable-next-line no-console
            console.log('[save]', msg);
            // Optionally toast
            if (typeof window !== 'undefined') {
              // eslint-disable-next-line no-alert
              alert(msg);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[save error]', e);
            if (typeof window !== 'undefined') {
              // eslint-disable-next-line no-alert
              alert('Save failed: ' + e.message);
            }
          }
          break;
        }
        default:
          // eslint-disable-next-line no-console
          console.log('[action:unknown]', a);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Action failed', a, e);
    }
  }
}

function renderTemplate(tpl, ctx) {
  if (!tpl || typeof tpl !== 'string') return String(tpl ?? '');
  return tpl.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    try {
      const path = String(expr).trim().split('.');
      let cur = ctx;
      for (const p of path) cur = cur?.[p];
      return cur == null ? '' : String(cur);
    } catch { return ''; }
  });
}
