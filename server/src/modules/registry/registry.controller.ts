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
          }
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
