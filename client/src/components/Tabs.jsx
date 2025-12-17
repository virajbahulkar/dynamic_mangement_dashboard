import React from 'react';
import PropTypes from 'prop-types';

export default function Tabs({ tabs = [], activeId: activeProp, onChange }) {
  const [active, setActive] = React.useState(activeProp || (tabs[0]?.id));
  React.useEffect(() => { if (activeProp) setActive(activeProp); }, [activeProp]);
  const click = (id) => { setActive(id); if (typeof onChange === 'function') onChange(id); };
  return (
    <div>
      <div className="flex border-b">
        {tabs.map(t => (
          <button key={t.id} className={`px-3 py-2 text-sm ${active===t.id?'border-b-2 border-blue-600 font-medium':''}`} onClick={()=>click(t.id)}>
            {t.title || t.id}
          </button>
        ))}
      </div>
      <div className="pt-2">
        {tabs.map(t => active===t.id ? (
          <div key={t.id} className="p-2">{t.content || t.children || null}</div>
        ) : null)}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, title: PropTypes.string, content: PropTypes.node })),
  activeId: PropTypes.string,
  onChange: PropTypes.func,
};
