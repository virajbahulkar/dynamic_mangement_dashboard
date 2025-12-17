import { Controller, Get } from '@nestjs/common';

@Controller('registry')
export class RegistryController {
  // Minimal static catalog for builder bootstrap; extend as needed or load from files.
  private catalog = [
    {
      type: 'chart.bar',
      version: '1.0.0',
      category: 'Charts',
      icon: 'bar_chart',
      defaults: { height: 250 },
      propsSchema: {
        type: 'object',
        properties: {
          xField: { type: 'string', title: 'X Field' },
          yField: { type: 'string', title: 'Y Field' },
          legendField: { type: 'string', title: 'Legend Field' },
          height: { type: 'number', minimum: 120, maximum: 1000 },
        },
        required: []
      },
      events: ['onLoad', 'onPointClick'],
      slots: [],
      styleSchema: {
        type: 'object',
        properties: { cardTitle: { type: 'string' }, padding: { type: 'number' } }
      }
    },
    {
      type: 'form.wizard',
      version: '1.0.0',
      category: 'Forms',
      icon: 'view_carousel',
      defaults: {
        formStyle: 'stacked',
        submitButton: { text: 'Submit' },
        steps: [
          {
            id: 'basic',
            title: 'Basic Info',
            fields: [
              { id: 'fullName', label: 'Full name', type: 'text', isFormField: true, validationType: 'string', validations: [{ type:'required', params:['Required'] }] },
              { id: 'role', label: 'Role', type: 'select', options:[{label:'User',value:'user'},{label:'Admin',value:'admin'}], isFormField: true, validationType: 'string', validations:[{ type:'required', params:['Required'] }] },
            ]
          },
          {
            id: 'details',
            title: 'Details',
            fields: [
              { id: 'email', label: 'Email', type: 'text', isFormField: true, validationType: 'string', validations:[{ type:'email', params:['Invalid email'] }] },
              { id: 'adminCode', label: 'Admin code', type: 'text', isFormField: true, validationType: 'string', showWhen: { field:'role', equals:'admin' }, validations:[{ type:'min', params:[4,'Min 4 chars'] }] },
            ]
          }
        ]
      },
      propsSchema: {
        type: 'object',
        properties: {
          steps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                showWhen: { type: 'object' },
                fields: { type: 'array', items: { type: 'object' } },
              },
              required: ['id','fields']
            }
          },
          formStyle: { type: 'string', enum: ['inline','stacked'] },
          submitButton: { type: 'object', properties: { text: { type: 'string' } } },
          onSubmitActions: { type: 'array', items: { type: 'object' }, title: 'On Submit Actions' }
        },
        required: []
      },
      events: ['onSubmit'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'chart.line',
      version: '1.0.0',
      category: 'Charts',
      icon: 'show_chart',
      defaults: { height: 250 },
      propsSchema: {
        type: 'object',
        properties: {
          xField: { type: 'string', title: 'X Field' },
          yField: { type: 'string', title: 'Y Field' },
          height: { type: 'number', minimum: 120, maximum: 1000 },
        }
      },
      events: ['onLoad', 'onPointClick'],
      slots: [],
      styleSchema: { type: 'object', properties: { smooth: { type: 'boolean' } } }
    },
    {
      type: 'chart.pie',
      version: '1.0.0',
      category: 'Charts',
      icon: 'pie_chart',
      defaults: { height: 250 },
      propsSchema: {
        type: 'object',
        properties: {
          valueField: { type: 'string', title: 'Value Field' },
          labelField: { type: 'string', title: 'Label Field' },
          height: { type: 'number', minimum: 120, maximum: 1000 },
        }
      },
      events: ['onLoad', 'onSliceClick'],
      slots: [],
      styleSchema: { type: 'object', properties: { donut: { type: 'boolean' } } }
    },
    {
      type: 'chart.stackedBar',
      version: '1.0.0',
      category: 'Charts',
      icon: 'stacked_bar_chart',
      defaults: { height: 250 },
      propsSchema: {
        type: 'object',
        properties: {
          xField: { type: 'string' },
          yField: { type: 'string' },
          legendField: { type: 'string' },
        },
        required: ['xField','yField']
      },
      events: ['onLoad'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'ui.button',
      version: '1.0.0',
      category: 'UI',
      icon: 'smart_button',
      defaults: { text: 'Click Me' },
      propsSchema: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          variant: { type: 'string', enum: ['primary','secondary','danger'] },
        }
      },
      events: ['onClick'],
      slots: [],
      styleSchema: { type: 'object', properties: { fullWidth: { type: 'boolean' } } }
    },
    {
      type: 'ui.multiselect',
      version: '1.0.0',
      category: 'UI',
      icon: 'checklist',
      defaults: { options: [], placeholder: 'Select...' },
      propsSchema: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          options: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'any' } } } },
          value: { type: 'array' },
          placeholder: { type: 'string' },
          onChangeActions: { type: 'array', items: { type: 'object' } },
        }
      },
      events: ['onChange'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'ui.textarea',
      version: '1.0.0',
      category: 'UI',
      icon: 'text_fields',
      defaults: { rows: 4, placeholder: '' },
      propsSchema: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          value: { type: 'string' },
          placeholder: { type: 'string' },
          rows: { type: 'number', minimum: 1, maximum: 20 },
          onChangeActions: { type: 'array', items: { type: 'object' } },
        }
      },
      events: ['onChange'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'ui.dateinput',
      version: '1.0.0',
      category: 'UI',
      icon: 'calendar_today',
      defaults: { placeholder: '' },
      propsSchema: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          value: { type: 'string' },
          placeholder: { type: 'string' },
          min: { type: 'string' },
          max: { type: 'string' },
          onChangeActions: { type: 'array', items: { type: 'object' } },
        }
      },
      events: ['onChange'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'ui.badge',
      version: '1.0.0',
      category: 'UI',
      icon: 'label',
      defaults: { text: 'Badge', variant: 'gray' },
      propsSchema: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          variant: { type: 'string', enum: ['primary','success','warning','danger','gray'] },
        }
      },
      events: [],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'ui.tabs',
      version: '1.0.0',
      category: 'UI',
      icon: 'tab',
      defaults: { tabs: [] },
      propsSchema: {
        type: 'object',
        properties: {
          tabs: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' } } } },
          activeId: { type: 'string' },
        }
      },
      events: ['onChange'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'table.basic',
      version: '1.0.0',
      category: 'Data',
      icon: 'table_chart',
      defaults: { pageSize: 10 },
      propsSchema: {
        type: 'object',
        properties: {
          columns: { type: 'array', items: { type: 'string' } },
          pageSize: { type: 'number', minimum: 5, maximum: 100 },
        }
      },
      events: ['onRowClick'],
      slots: [],
      styleSchema: { type: 'object', properties: { striped: { type: 'boolean' } } }
    },
    {
      type: 'form.dynamic',
      version: '1.0.0',
      category: 'Forms',
      icon: 'dynamic_form',
      defaults: { formStyle: 'stacked', submitButton: { text: 'Submit' } },
      propsSchema: {
        type: 'object',
        properties: {
          fieldsJson: { type: 'string', title: 'Fields (JSON)', description: 'Array of field configs' },
          formStyle: { type: 'string', enum: ['inline','stacked'] },
          submitButton: {
            type: 'object',
            properties: {
              text: { type: 'string', default: 'Submit' }
            }
          },
          onSubmitActions: { type: 'array', items: { type: 'object' }, title: 'On Submit Actions' }
        },
        required: ['fieldsJson']
      },
      events: ['onSubmit'],
      slots: [],
      styleSchema: { type: 'object', properties: {} }
    },
    {
      type: 'layout.container',
      version: '1.0.0',
      category: 'Layout',
      icon: 'crop_square',
      defaults: { title: 'Container' },
      propsSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          style: { type: 'object' }
        }
      },
      events: [],
      slots: [ { name: 'content', accepts: ['*'] } ],
      styleSchema: { type: 'object', properties: {} }
    }
  ];

  @Get('components')
  list() {
    return { components: this.catalog };
  }

  @Get('version')
  version() {
    return { version: '1.0.0', count: this.catalog.length };
  }
}
